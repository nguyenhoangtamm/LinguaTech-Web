import http from '@/lib/http';


const fileApiRequest = {
    upload: (file: File)=> http.post<FormData>('/files/upload', file),
    download: (fileId: string) => http.get(`/files/download/${fileId}`, { responseType: 'blob' }),
    delete: (fileId: string) => http.post(`/files/delete/${fileId}`, null),
};

export default fileApiRequest;
