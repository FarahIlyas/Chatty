import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";

const UserPage = () => {
  return (
    <>
      <UserHeader />
      <UserPost
        likes={1200}
        replies={481}
        postImg="/post1.png"
        postTitle="Let's talk about Chatty."
      />
      <UserPost
        likes={451}
        replies={135}
        postImg="/post2.png"
        postTitle="Great tutorial"
      />
      <UserPost
        likes={254}
        replies={69}
        postImg="/post3.png"
        postTitle="I love this guy."
      />
      <UserPost likes={24} replies={6} postTitle="My first chat y'all!" />
    </>
  );
};

export default UserPage;
