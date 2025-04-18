export default {
  dateFormater: (dateString) => {
    return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date(dateString))},
  nameFormater(name) {
    if (
      Array.isArray(name) &&
      name.length &&
      name[0].given &&
      Array.isArray(name[0].given)
    ) {
      return name[0].given[0];
    }
    return null;
  },
  familyFormater(name) {
    if (Array.isArray(name)) {
      return name[0].family;
    }
    return undefined;
  },

}