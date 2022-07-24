import axios from 'axios';
import { useState } from 'react';

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      const response = await axios[method](url, { ...body, ...props });

      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (error) {
      setErrors(
        <ul className="list-group">
          {error.response.data.errors.map((err) => (
            <li
              className="list-group-item list-group-item-action list-group-item-danger"
              key={err.message}
            >
              {err.message}
            </li>
          ))}
        </ul>
      );
    }
  };

  return { doRequest, errors };
};

export default useRequest;
