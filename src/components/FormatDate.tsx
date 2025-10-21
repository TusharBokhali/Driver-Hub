export const formatDate = (input: string | Date): string => {
  let date: Date;

  if (input instanceof Date) {
    date = input;
  } else {
    const parts = input.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year.slice(-2)}`;
    }
    date = new Date(input);
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);

  return `${day}/${month}/${year}`;
};
