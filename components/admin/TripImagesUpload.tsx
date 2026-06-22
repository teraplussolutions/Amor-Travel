"use client";

import { useState } from "react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

type TripImage = {
  id: string;
  slug: string;
  url: string;
};

let tripCounter = 0;

function newTripId() {
  tripCounter += 1;
  return `trip-${Date.now()}-${tripCounter}`;
}

export function TripImagesUpload() {
  const [trips, setTrips] = useState<TripImage[]>([
    { id: newTripId(), slug: "antalya", url: "" },
  ]);

  function updateTrip(id: string, patch: Partial<TripImage>) {
    setTrips((prev) =>
      prev.map((trip) => (trip.id === id ? { ...trip, ...patch } : trip)),
    );
  }

  function addTrip() {
    setTrips((prev) => [
      ...prev,
      { id: newTripId(), slug: `trip-${prev.length + 1}`, url: "" },
    ]);
  }

  function removeTrip(id: string) {
    setTrips((prev) =>
      prev.length <= 1 ? prev : prev.filter((trip) => trip.id !== id),
    );
  }

  return (
    <div className="space-y-8">
      {trips.map((trip, index) => (
        <div key={trip.id} className="card space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-amor-blue">Trip image {index + 1}</h3>
            {trips.length > 1 && (
              <button
                type="button"
                onClick={() => removeTrip(trip.id)}
                className="text-base font-medium text-amor-red"
              >
                Remove
              </button>
            )}
          </div>

          <label className="block">
            <span className="form-label">Trip slug (filename prefix)</span>
            <input
              type="text"
              value={trip.slug}
              onChange={(e) => updateTrip(trip.id, { slug: e.target.value })}
              className="form-input max-w-md"
              placeholder="antalya"
            />
          </label>

          <ImageUploadField
            folder="trips"
            namePrefix={trip.slug || `trip-${index + 1}`}
            label="Trip card image"
            hint="4:3 preview — fits trip cards with object-fit cover, auto-compressed."
            aspectClass="aspect-[4/3] max-w-md"
            value={trip.url}
            onChange={(url) => updateTrip(trip.id, { url })}
            alt={trip.slug ? `${trip.slug} trip` : "Trip image"}
          />
        </div>
      ))}

      <button type="button" onClick={addTrip} className="btn-secondary">
        Add trip image
      </button>
    </div>
  );
}
