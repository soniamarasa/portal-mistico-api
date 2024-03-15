import mongoose from 'mongoose';

const cardsSchema = mongoose.Schema({
  name: String,
  tags: Array,
  description: String,
  tarology: String,
  taromancy: String,
  idCard: String,
  type: Object,
});

const cardsModel = mongoose.model('cards', cardsSchema);

export default cardsModel;
