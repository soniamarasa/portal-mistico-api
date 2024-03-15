import mongoose from 'mongoose';

const tarotReadingTypeSchema = mongoose.Schema({
  userId: String,
  name: String,
  color: String,
  description: String,
});

const tarotReadingTypeModel = mongoose.model('tarotReadingType', tarotReadingTypeSchema);

export default tarotReadingTypeModel;
