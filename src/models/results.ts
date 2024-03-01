import mongoose, { Schema, Document } from 'mongoose';

interface I extends Document {
  section_name?: string | null;
  
  
}

const resultSchema: Schema<I> = new Schema<I>(
  {
    section_name: {
      type: String,
      default: null,
    }
   

  },
  { timestamps: true }
);

resultSchema.virtual('id').get(function (this: I) {
  return this._id?.toHexString();
});

resultSchema.set('toJSON', {
  virtuals: true,
  transform: function (_, ret) {
    const newRet = { id: ret._id };
    delete ret._id;
    delete ret.__v;
    Object.assign(newRet, ret);
    return newRet;
  }
});

resultSchema.post('save', async () => {
  // Your post-save logic here
});

const ResultModel = mongoose.model<I>('Results', resultSchema);
export default ResultModel;
