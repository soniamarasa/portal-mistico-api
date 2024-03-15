import mongoose from 'mongoose';

const cardsTypeSchema = mongoose.Schema({
  name: String,
  color: String,
  description: String,
});

const cardsTypeModel = mongoose.model('cardsType', cardsTypeSchema);

export default cardsTypeModel;
