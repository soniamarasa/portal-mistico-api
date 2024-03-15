import cardTypeModel from '../models/cardsTypeModel.js';

const getCardTypes = async (req, res) => {
  const userId = req.userId;
  try {
    const cardTypes = await cardTypeModel.find({
      userId: userId,
    });
    res.send(cardTypes);
  } catch (error) {
    res.send(500).send({
      message: 'Ocorreu um erro ao pesquisar os tipos de cartas.' + error,
    });
  }
};

const newCardType = async (req, res) => {
  const cardTypeBody = req.body;

  let cardType = new cardTypeModel(cardTypeBody);
  cardType.userId = req.userId;

  try {
    await cardType.save();

    res.send(cardType);
  } catch (error) {
    res.status(500).send({
      message:
        'Um erro ocorreu ao criar o tipo de carta. Tente novamente mais tarde. ',
    });
  }
};

const updateCardType = async (req, res) => {
  const userId = req.userId;
  const id = req.params.id;
  const cardTypeBody = req.body;

  try {
    const item = await cardTypeModel.findById({
      _id: id,
    });

    if (item.userId !== userId) {
      return res.status(500).send({
        message: 'Você nao tem permissão para editar esse tipo de carta.',
      });
    }

    let cardType = await cardTypeModel.findByIdAndUpdate(
      {
        _id: id,
      },
      cardTypeBody,
      {
        new: true,
      }
    );

    if (!cardType) {
      res.send({
        message: 'Tipo de carta não encontrado',
      });
    } else {
      res.send(cardType);
    }
  } catch (error) {
    res.status(500).send({
      message:
        'Um erro ocorreu ao atualizar o tipo de carta. Tente novamente mais tarde.',
    });
  }
};

const deleteCardType = async (req, res) => {
  const id = req.params.id;
  const userId = req.userId;

  try {
    const cardType = await cardTypeModel.findById({
      _id: id,
    });
    if (cardType.userId !== userId) {
      return res.status(500).send({
        message: 'Você não tem permissão para deletar esse tipo de carta.',
      });
    }

    const dataId = await cardTypeModel.findByIdAndRemove({
      _id: id,
    });
    if (!dataId) {
      res.send({
        message: 'Tipo de carta não encontrado.',
      });
    } else {
      res.send({ message: 'Tipo de carta deletado com sucesso!' });
    }
  } catch (error) {
    res.status(500).send({
      message:
        'Um erro ocorreu ao deletar o tipo de carta. Tente novamente mais tarde.' +
        error,
    });
  }
};

export { getCardTypes, newCardType, updateCardType, deleteCardType };
