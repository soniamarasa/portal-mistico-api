import tarotReadingTypeModel from '../models/tarotReadingTypeModel.js';

const getTarotReadingTypes = async (req, res) => {
  const userId = req.userId;
  try {
    const tarotReadingTypes = await tarotReadingTypeModel.find({
      userId: userId,
    });
    res.send(tarotReadingTypes);
  } catch (error) {
    res.send(500).send({
      message: 'Ocorreu um erro ao pesquisar os tipos de tiragens.' + error,
    });
  }
};

const newTarotReadingType = async (req, res) => {
  const tarotReadingTypeBody = req.body;

  let tarotReadingType = new tarotReadingTypeModel(tarotReadingTypeBody);
  tarotReadingType.userId = req.userId;

  try {
    await tarotReadingType.save();

    res.send(tarotReadingType);
  } catch (error) {
    res.status(500).send({
      message:
        'Um erro ocorreu ao criar o tipo de tiragem. Tente novamente mais tarde. '
    });
  }
};

const updateTarotReadingType = async (req, res) => {
  const userId = req.userId;
  const id = req.params.id;
  const tarotReadingTypeBody = req.body;

  try {
    const item = await tarotReadingTypeModel.findById({
      _id: id,
    });

    if (item.userId !== userId) {
      return res.status(500).send({
        message: 'Você nao tem permissão para editar esse tipo de tiragem.',
      });
    }

    let tarotReadingType = await tarotReadingTypeModel.findByIdAndUpdate(
      {
        _id: id,
      },
      tarotReadingTypeBody,
      {
        new: true,
      }
    );

    if (!tarotReadingType) {
      res.send({
        message: 'Tipo de tiragem não encontrada.',
      });
    } else {

      res.send(tarotReadingType);
    }
  } catch (error) {
    res.status(500).send({
      message:
        'Um erro ocorreu ao atualizar esse tipo de tiragem. Tente novamente mais tarde.' 
    });
  }
};

const deleteTarotReadingType = async (req, res) => {
  const id = req.params.id;
  const userId = req.userId;

  try {
    const tarotReadingType = await tarotReadingTypeModel.findById({
      _id: id,
    });
    if (tarotReadingType.userId !== userId) {
      return res.status(500).send({
        message: 'Você não tem permissão para deletar esse tipo de tiragem.',
      });
    }

    const dataId = await tarotReadingTypeModel.findByIdAndRemove({
      _id: id,
    });
    if (!dataId) {
      res.send({
        message: 'Tipo de tiragem não encontrada.',
      });
    } else {
      res.send({ message: 'Tipo de tiragem deletada com sucesso!' });
    }
  } catch (error) {
    res.status(500).send({
      message:
        'Um erro ocorreu ao deletar o tipo de tiragem. Tente novamente mais tarde.' +
        error,
    });
  }
};

export { getTarotReadingTypes, newTarotReadingType, updateTarotReadingType, deleteTarotReadingType };
