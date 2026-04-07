const API_BASE = '/api';

let currentAccessToken: string | null = null;

export const  setAccessToken = (token : string | null) => {
  currentAccessToken = token;
}

export const fetchClient = async (endpoint:string, options: RequestInit = {}) => {
        
      const isFormData = options.body instanceof FormData;

      const config: RequestInit = {
            headers:{
              ...(!isFormData && {'Content-Type':'application/json'}),
                  ...(currentAccessToken && { Authorization: `Bearer ${currentAccessToken}` }),
            },
            credentials: 'include',  //For httpOnly Cookie
            ...options,
      };

      const response = await fetch(`${API_BASE}${endpoint}`, config);

      if(response.status === 401 || response.status=== 403){
            try{
              const refreshRes = await fetch('/api/auth/refresh', {
                method: 'POST',
                credentials: 'include',
              });

              if(refreshRes.ok){
                const refreshData = await refreshRes.json();
                setAccessToken(refreshData.accessToken);

                return fetchClient(endpoint, options);
              }
            }catch {}
      }
          

      if(!response.ok){
            const errorData= await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Request Data');
      }

      const data = await response.json();

      if(data.accessToken){
        setAccessToken(data.accessToken);
      }

      return data;
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
