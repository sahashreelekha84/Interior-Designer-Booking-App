import axios from 'axios'
export const fetchUsers = async () => {
  const res = await axios.get('http://localhost:3005/api/designer/profile');
  console.log(res?.data?.data);
  
  return res?.data?.data;
};
const des_id=localStorage.getItem('des_id')
export const fetchappointment = async () => {
  const res = await axios.get(`http://localhost:3005/api/editdesigner/${des_id}`);
  console.log(res?.data?.data.slots_booked);
  
  return res?.data?.data.slots_booked;
};
export const fetchbookingslot = async () => {
  const res = await axios.get(`http://localhost:3005/api/bookappointment/${des_id}`);
  console.log(res?.data?.data.slots_booked);
  
  return res?.data?.data.slots_booked;
};