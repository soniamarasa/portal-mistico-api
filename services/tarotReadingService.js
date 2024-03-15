import tarotReadingModel from '../models/tarotReadingModel.js';

const getTarotReading = async (req, res) => {
  const userId = req.userId;
  try {
    const tarotReading = await tarotReadingModel.find({
      userId: userId,
    });
    res.send(tarotReading);
  } catch (error) {
    res.send(500).send({
      message: 'Ocorreu um erro ao pesquisar as tiragens.' + error,
    });
  }
};

const newTarotReading = async (req, res) => {
  const tarotReadingBody = req.body;

  let tarotReading = new tarotReadingModel(tarotReadingBody);
  tarotReading.userId = req.userId;

  try {
    await tarotReading.save();

    res.send(tarotReading);
  } catch (error) {
    res.status(500).send({
      message:
        'Um erro ocorreu ao criar a tiragem. Tente novamente mais tarde. ',
    });
  }
};

const updateTarotReading = async (req, res) => {
  const userId = req.userId;
  const id = req.params.id;
  const tarotReadingBody = req.body;

  try {
    const item = await tarotReadingModel.findById({
      _id: id,
    });

    if (item.userId !== userId) {
      return res.status(500).send({
        message: 'Você nao tem permissão para editar essa tiragem.',
      });
    }

    let tarotReading = await tarotReadingModel.findByIdAndUpdate(
      {
        _id: id,
      },
      tarotReadingBody,
      {
        new: true,
      }
    );

    if (!tarotReading) {
      res.send({
        message: 'Tiragem não encontrada',
      });
    } else {
      res.send(tarotReading);
    }
  } catch (error) {
    res.status(500).send({
      message:
        'Um erro ocorreu ao atualizar a tiragem. Tente novamente mais tarde.',
    });
  }
};

const deleteTarotReading = async (req, res) => {
  const id = req.params.id;
  const userId = req.userId;

  try {
    const tarotReading = await tarotReadingModel.findById({
      _id: id,
    });
    if (tarotReading.userId !== userId) {
      return res.status(500).send({
        message: 'Você não tem permissão para deletar essa tiragem.',
      });
    }

    const dataId = await tarotReadingModel.findByIdAndRemove({
      _id: id,
    });
    if (!dataId) {
      res.send({
        message: 'Tiragem não encontrada.',
      });
    } else {
      res.send({ message: 'Tiragem deletada com sucesso!' });
    }
  } catch (error) {
    res.status(500).send({
      message:
        'Um erro ocorreu ao deletar a tiragem. Tente novamente mais tarde.' +
        error,
    });
  }
};

export {
  getTarotReading,
  newTarotReading,
  updateTarotReading,
  deleteTarotReading,
};
