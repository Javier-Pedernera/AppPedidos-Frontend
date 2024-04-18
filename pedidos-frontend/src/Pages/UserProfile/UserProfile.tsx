import { useEffect, useState } from 'react';
import { userLogIn } from '../../Redux/Actions/UserGet';
import Cookies from "js-cookie";
import { useAppDispatch, useAppSelector } from '../../Redux/Store/hooks';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import '../../scss/components/userProfile.scss';
import { LiaClipboardCheckSolid } from 'react-icons/lia';
import { RxClipboardCopy } from 'react-icons/rx';

interface UserProfileModel {
  email: string;
  id: string;
}

const UserProfile = () => {
  const userActive: UserProfileModel = useAppSelector((state: any) => state.user).userData;
  const [IdCopy, setIdCopy] = useState(false);
  // console.log(userActive.accessToken);
  // const user: UserProfileModel = userActive.userData
  const dispatch = useAppDispatch()
  useEffect(() => {
    const token = Cookies.get("data");
    if (token && !userActive.id) {
      dispatch(userLogIn(null, token));
    }

  }, [dispatch]);
  console.log(userActive);
  const handlecopyText = () => {
    setIdCopy(!IdCopy)
  }
  return (
    <div className='userPContainer'>
      <div className="user-profile">
        <h2>User Profile</h2>
        <div className="profile-info">
          <p><strong>Name:</strong> {userActive.email}
          </p>
          <hr />
          <strong>UsderId:</strong>
          <div className='IdUser_content'>
            <CopyToClipboard text={userActive.id}
              onCopy={() => {
                handlecopyText();
              }}>
              {IdCopy ? <span className='user_copied'>{userActive.id}<LiaClipboardCheckSolid className='ico_copied' /> <span  className='textcopiedid'>copied!</span> </span> : <span>{userActive.id}<RxClipboardCopy className='ico_copy' /></span>}
            </CopyToClipboard></div> */
            
          {/* /* <p> {userActive.id}</p> */}
        </div>
      </div>
    </div>

  );
};

export default UserProfile;