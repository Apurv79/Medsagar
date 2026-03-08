import dayjs from "dayjs";
import { SLOT_DURATION, CANCELLATION_WINDOW_HOURS } from "./appointment.constants.js";

export const calculateSlotEnd = (slotStart) => {
  return dayjs(slotStart).add(SLOT_DURATION, "minute").toDate();
};

export const isCancellationAllowed = (slotStart) => {
  const diff = dayjs(slotStart).diff(dayjs(), "hour");
  return diff >= CANCELLATION_WINDOW_HOURS;
};

export const generateSlots = (start, end) => {
  const slots = [];
  let current = dayjs(start);

  while (current.isBefore(end)) {
    const slotStart = current.toDate();
    const slotEnd = current.add(SLOT_DURATION, "minute").toDate();

    slots.push({ slotStart, slotEnd });

    current = current.add(SLOT_DURATION, "minute");
  }

  return slots;
};