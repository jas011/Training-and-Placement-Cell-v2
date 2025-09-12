export const parseDate = (d: string) => {
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const date = new Date(d);
  const day = date.getDate();
  const year = date.getFullYear();
  const mon = month[date.getMonth()];
  //   const hours = date.getHours();
  //   const minutes = date.getMinutes();

  return ` ${mon} ${day}, ${year} `;
};
// at ${
//     hours > 12 ? hours - 12 : hours
//   }:${minutes} ${hours > 12 ? "PM" : "AM"}
