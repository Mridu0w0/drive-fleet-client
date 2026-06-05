import UpdateCarForm from "@/component/UpdateCarForm";
import React from "react";

const UpdateCars = async ({ params }) => {
  const { id } = await params;
  return (
    <div className="">
      <h1 className="text-center text-5xl font-bold my-10">
        Update Car Information
      </h1>
      <UpdateCarForm carId={id}></UpdateCarForm>
    </div>
  );
};

export default UpdateCars;
