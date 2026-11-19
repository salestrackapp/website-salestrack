(() => {
  const form = document.querySelector('#contact-capture');
  if (!form) return;
  const topics = {prospeccao: 'Tenho interesse no treinamento em Prospecção B2B.', vendas: 'Tenho interesse no treinamento em Vendas Internas.', operacao: 'Quero conversar sobre nossa operação de prospecção e vendas internas.'};
  const topic = topics[new URLSearchParams(location.search).get('interesse')];
  if (topic && !form.elements.need.value) form.elements.need.value = topic + '\n\nNosso contexto: ';
})();
