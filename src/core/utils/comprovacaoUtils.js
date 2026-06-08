import { httpClient } from '../api/httpClient';

export const handleVerComprovacao = async (email, endpoint) => {
  try {
    const response = await httpClient.get(endpoint(email), {
      responseType: 'blob',
    });

    const contentType = response.headers['content-type']?.split(';')[0].trim();
    const disposition = response.headers['content-disposition'];

    const nomeBase = disposition
      ?.split('filename=')?.[1]
      ?.replace(/"/g, '')
      ?? 'comprovacao';

    const extensao = contentType !== 'application/octet-stream'
      ? contentType?.split('/')?.[1] ?? ''
      : '';

    const nomeArquivo = extensao && !nomeBase.includes('.')
      ? `${nomeBase}.${extensao}`
      : nomeBase;

    const url = URL.createObjectURL(new Blob([response.data], { type: contentType }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', nomeArquivo);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Erro ao carregar comprovação de deficiência:', err);
    alert('Não foi possível carregar a comprovação de deficiência.');
  }
};