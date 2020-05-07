import { format, parseISO } from 'date-fns';

const formatDate = (date: string): string => {
  const formatedDate = format(parseISO(date), "dd'/'MM'/'yyy");

  return formatedDate;
};

export default formatDate;
