import axios from 'axios';

export const fetchMuseumDetails = async (id: string) => {
    const response = await axios.get(`/api/museums/${id}`);
    return response.data.data;
}