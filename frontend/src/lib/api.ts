const API_BASE = '/api';

export const fetchClient = async (endpoint:string, options: RequestInit = {}) => {
        const token = localStorage.getItem('accessToken');

      const config: RequestInit = {
            headers:{
                  'Content-Type':'application/json',
                  ...(token && { Authorization: `Bearer ${token}` }),
            },
            credentials: 'include',  //For httpOnly Cookie
            ...options,
      };

      const response = await fetch(`${API_BASE}${endpoint}`, config);

      if(response.status=== 403){
            const refreshed = await refreshAccessToken();
            if(refreshed){
                return   fetchClient(endpoint, options);
            }
      }     

      if(!response.ok){
            const errorData= await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Request Data');
      }

      return response.json();
};

const refreshAccessToken = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!res.ok) return false;

    const data = await res.json();

    // Store access token if you're using it manually
    localStorage.setItem('accessToken', data.accessToken);

    return true;
  } catch {
    return false;
  }
};

export default fetchClient;
