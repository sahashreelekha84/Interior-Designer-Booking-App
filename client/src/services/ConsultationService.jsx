
import axiosInstance from '../Api/axiosInstance/axiosInstance';
export const fetchUsers = async () => {
  const res = await axiosInstance.get('http://localhost:3005/api/designer/profile');
  console.log(res?.data?.data);
  
  return res?.data?.data;
};
export const fetchdashbord = async () => {
  const res = await axiosInstance.get(`http://localhost:3005/api/designer/dasboard?ts=${Date.now()}`);
  console.log('fetchdashbord',res?.data?.data);
  
  return res?.data?.data;
};

export const fetchconsultation = async () => {
  const res = await axiosInstance.get('http://localhost:3005/api/detailDesigner');
  console.log('consult',res?.data?.data);
  
  return res?.data?.data;
};