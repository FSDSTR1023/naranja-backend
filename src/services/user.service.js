import User from '../models/user.model.js'
export async function changeStatusUser(user) {
  const userToChangeStatus = { ...user, isOnline: 'offline' }
  try {
    const newStatusUser = await User.findByIdAndUpdate(
      userToChangeStatus._id,
      userToChangeStatus,
      {
        new: true,
      }
    )
    return newStatusUser
  } catch (error) {
    console.error(error, '<--- ERROR')
  }
}
