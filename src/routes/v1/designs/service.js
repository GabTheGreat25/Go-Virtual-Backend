import model from "./model.js";

async function getAll() {
  return await model.find();
}

async function getById(_id) {
  return await model.findOne({ _id });
}

async function getDefaultById(_id) {
  return await model.findOne({ _id, user: null });
}

async function add(body, session) {
  return (await model
    .findOne({ "content.contentId": body.content.contentId })
    .session(session))
    ? [
        await model.findOneAndUpdate(
          { "content.contentId": body.content.contentId },
          { $set: { "content.$.imageId": body.content.imageId } },
          { new: true, session },
        ),
      ]
    : await model.create(
        [
          {
            content: {
              contentId: body.content.contentId,
              imageId: body.content.imageId,
            },
          },
        ],
        { session },
      );
}

async function update(_id, body, session) {
  return await model.findByIdAndUpdate(_id, body, {
    new: true,
    runValidators: true,
    session,
  });
}

async function deleteById(_id, session) {
  return await model.findByIdAndDelete(_id, { session });
}

async function removeImage(imageId, session) {
  return await model.updateMany(
    { "content.imageId": imageId },
    { $set: { "content.$[elem].imageId": null } },
    {
      arrayFilters: [{ "elem.imageId": imageId }],
      new: true,
      session,
    },
  );
}

export default {
  getAll,
  getById,
  getDefaultById,
  add,
  update,
  deleteById,
  removeImage,
};
