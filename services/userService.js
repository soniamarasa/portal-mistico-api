import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import * as Yup from 'yup';

import userModel from '../models/userModel.js';
import sendEmail from '../utils/sendEmail.js';

const createAccount = async (req, res) => {
  let { email, password } = req.body;

  const schema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().required().min(8),
    name: Yup.string().required(),
    birthdate: Yup.date().required(),
    gender: Yup.string().required(),
  });

  if (!(await schema.isValid(req.body)))
    return res
      .status(400)
      .json({ error: 'Verifique as informações inseridas!' });

  const userExists = await userModel.findOne({
    email,
  });

  if (userExists) return res.status(400).json({ error: 'Usuário já existe!' });

  req.body.password = await bcrypt.hash(password, 8);

  try {
    const { id, name, email, gender, birthdate, username } =
      await userModel.create(req.body);
    return res.json({ id, name, email, gender, birthdate, username });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: 'Não foi possível criar sua conta.' });
  }
};

const login = async (req, res) => {
  let { email, password } = req.body;

  const schema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().required(),
  });

  if (!(await schema.isValid(req.body)))
    return res
      .status(400)
      .json({ error: 'Verifique as informações inseridas!' });

  const userExists = await userModel.findOne({
    email,
  });

  if (!userExists)
    return res.status(400).json({ error: 'Usuário não existe!' });
  else {
    const checkPassword = await bcrypt.compare(password, userExists.password);

    if (checkPassword) {
      const { _id, email, name, gender, birthdate, username, password } =
        userExists;
      return res.json({
        user: {
          _id,
          name,
          email,
          gender,
          birthdate,
          username,
          token: jwt.sign({ _id }, process.env.SECRET, {
            expiresIn: process.env.EXPIRESIN,
          }),
        },
      });
    } else {
      return res.status(400).json({ error: 'Senha incorreta!' });
    }
  }
};

const logout = async (req, res) => {
  return res.status(200).json({ user: null });
};

const getUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    let user = await userModel.findOne({
      _id: userId,
    });

    delete user['password'];

    res.send(user);
  } catch (error) {
    res.send(500).send({ message: 'Usuário não encontrado' + error });
  }
};

const updateUser = async (req, res) => {
  let {
    email,
    password,
    name,
    gender,
    birthdate,
    oldPassword,
    confirmPassword,
  } = req.body;
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: 'Id inválido!' });

  const schema = Yup.object().shape({
    name: Yup.string(),
    email: Yup.string().email(),
    birthdate: Yup.date(),
    gender: Yup.string(),
    oldPassword: Yup.string().min(6),
    password: Yup.string()
      .min(6)
      .when('oldPassword', (oldPassword, field) =>
        oldPassword ? field.required() : field
      ),
    confirmPassword: Yup.string().when('password', (password, field) =>
      password ? field.required().oneOf([Yup.ref('password')]) : field
    ),
  });

  if (!(await schema.isValid(req.body)))
    return res
      .status(400)
      .json({ error: 'Verifique as informações inseridas!' });

  const userExists = await userModel.findById({
    _id: id,
  });

  if (!userExists)
    return res.status(400).json({ error: 'Usuário não existe!' });
  else {
    if (email !== userExists.email) {
      const emailExists = await userModel.findOne({
        email,
      });

      if (emailExists)
        return res.status(400).json({ error: 'E-mail já registrado!' });
    }

    if (oldPassword) {
      const checkPassword = await bcrypt.compare(
        oldPassword,
        userExists.password
      );
      if (!checkPassword)
        return res.status(400).json({ error: 'Senha incorreta!' });
    }

    if (password && confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ error: 'Senha atual não confere!' });
    }

    if (password) req.body.password = await bcrypt.hash(password, 8);

    const userUpdated = {
      email,
      name,
      gender,
      birthdate,
      ...(oldPassword && { password: req.body.password }),
    };

    const userEdited = await userModel.findByIdAndUpdate(
      {
        _id: id,
      },
      userUpdated,
      {
        new: true,
      }
    );
    return res.json(userEdited);
  }
};

const recoverPassword = async (req, res) => {
  let { email, host } = req.body;

  const schema = Yup.object().shape({
    email: Yup.string().email().required(),
  });

  if (!(await schema.isValid(req.body)))
    return res
      .status(400)
      .json({ error: 'Verifique as informações inseridas!' });

  const userExists = await userModel.findOne({
    email,
  });

  if (!userExists)
    return res.status(400).json({ error: 'Usuário não existe!' });
  else {
    let token = jwt.sign({ _id: userExists.id }, process.env.SECRET, {
      expiresIn: '2h',
    });

    const link = `${host}/password-reset/${token}`;
    await sendEmail(
      userExists.email,
      userExists.name,
      'Reset your password',
      link
    );

    return res.json({
      message:
        'O link para redefinir uma nova senha foi enviado para o seu e-mail.',
    });
  }
};

const resetPassword = async (req, res) => {
  let { password } = req.body;
  const userId = req.userId;

  const schema = Yup.object().shape({
    password: Yup.string().required().min(8),
  });

  if (!(await schema.isValid(req.body)))
    return res
      .status(400)
      .json({ error: 'Verifique as informações inseridas!' });

  const userExists = await userModel.findById({
    _id: userId,
  });

  if (!userExists)
    return res.status(400).json({ error: 'Usuário não existe!' });
  else {
    req.body.password = await bcrypt.hash(password, 8);

    const userUpdated = {
      email: userExists.email,
      name: userExists.name,
      gender: userExists.gender,
      birthdate: userExists.birthdate,
      password: req.body.password,
    };

    await userModel.findByIdAndUpdate(
      {
        _id: userId,
      },
      userUpdated
    );
    return res.json({ message: 'Senha alterada com sucesso!' });
  }
};

const authorization = async (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res
      .status(401)
      .json({ auth: false, message: 'Nenhum token fornecido.' });
  }

  jwt.verify(token, process.env.SECRET, function (err, decoded) {
    if (err) {
      console.log(err);
      if (err.name === 'TokenExpiredError') {
        return res
          .status(401)
          .json({ auth: false, message: 'Token expirado.' });
      }
      if (err.name === 'JsonWebTokenError') {
        return res
          .status(401)
          .json({ auth: false, message: 'Token inválido.' });
      }
      return res
        .status(401)
        .json({ auth: false, message: 'Falha ao autenticar o token.' });
    }

    req.userId = decoded._id;
    next();
  });
};

export {
  login,
  logout,
  authorization,
  createAccount,
  updateUser,
  recoverPassword,
  resetPassword,
  getUser,
};
