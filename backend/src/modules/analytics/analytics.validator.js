export const validateAnalyticsQuery = (query) => {

    const { startDate, endDate } = query;

    if (startDate && isNaN(Date.parse(startDate))) {
        throw new Error("Invalid start date");
    }

    if (endDate && isNaN(Date.parse(endDate))) {
        throw new Error("Invalid end date");
    }

};