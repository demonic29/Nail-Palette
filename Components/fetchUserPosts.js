import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase/firebase'; // Adjust path as needed

const fetchUserPosts = async (userId) => {
  try {
    const postsRef = collection(firestore, 'posts');
    const q = query(postsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    const userPosts = [];
    querySnapshot.forEach((doc) => {
      userPosts.push({ id: doc.id, ...doc.data() });
    });

    return userPosts;
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return [];
  }
};

export default fetchUserPosts;
