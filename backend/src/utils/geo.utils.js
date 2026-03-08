import logger from "./logger.js";

/*
Utility to create MongoDB GeoJSON point
Used for doctor / clinic location
*/
export const createGeoPoint = (lat, lng) => {
  try {
    const latitude = Number(lat);
    const longitude = Number(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      console.error("Invalid coordinates received:", lat, lng);
      throw new Error("Invalid coordinates");
    }

    const point = {
      type: "Point",
      coordinates: [longitude, latitude] // Mongo uses [lng, lat]
    };

    console.log("Geo point created:", point);

    return point;
  } catch (error) {
    logger.error("Error creating geo point", error);
    throw error;
  }
};

/*
Convert distance from km to meters
MongoDB geo queries use meters
*/
export const kmToMeters = (km) => {
  try {
    const meters = Number(km) * 1000;

    console.log(`Converted ${km} km to ${meters} meters`);

    return meters;
  } catch (error) {
    logger.error("Distance conversion failed", error);
    throw error;
  }
};