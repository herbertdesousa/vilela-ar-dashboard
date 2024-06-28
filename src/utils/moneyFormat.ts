import Intl from 'intl';
import 'intl/locale-data/jsonp/pt-BR';

const formatNumber = (valueToFormat: string): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(valueToFormat));
};

function moneyFormat(valueToFormat: number | string): string {
  const prefix: string =
    typeof valueToFormat === 'number' && valueToFormat < 0 ? '-' : '';

  const parsedValue = String(valueToFormat).replace(/\D/g, '');

  if (!Number(parsedValue)) {
    return '';
  }

  if (parsedValue.length <= 2) {
    return `R$0,${parsedValue.padStart(2, '0')}`;
  }

  const integerValue = parsedValue.slice(0, parsedValue.length - 2);
  const decimalValue = parsedValue.slice(
    parsedValue.length - 2,
    parsedValue.length,
  );

  const formattedValue = `${integerValue}.${decimalValue}`;

  const formatted = formatNumber(formattedValue);

  return `${prefix ? `${prefix} ` : ''}${formatted}`;
}

export default moneyFormat;
