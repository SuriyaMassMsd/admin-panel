import React from "react";
import { useFormContext } from "react-hook-form";

const Input = ({
  name,
  type,
  placeholder,
  validationSchema,
  error,
  className,
  options,
  data,
  id,
}) => {
  const { register } = useFormContext();

  console.log(data);

  const renderInputField = () => {
    switch (type) {
      case "textarea":
        return (
          <textarea
            placeholder={placeholder}
            className={`px-[10px] w-full py-[10px] border rounded outline-none placeholder:text-[#969696] placeholder:font-[500] text-[#969696] 
              ${error ? "border-red-500 shadow-md shadow-red-500/50 placeholder:text-red-500" : "border-gray-300 hover:border-[#00bbab] focus:border-[#00bbab]"} 
              ${className}`}
            {...register(name, validationSchema)}
          />
        );
      case "select":
        return (
          <select
            className={`px-[10px] w-full py-[10px] border rounded outline-none placeholder:text-[#969696] placeholder:font-[500] text-[#969696] 
              ${error ? "border-red-500 shadow-md shadow-red-500/50" : "border-gray-300 hover:border-[#00bbab] focus:border-[#00bbab]"} 
              ${className}`}
            {...register(name)}
          >
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case "email":
      case "password":
      case "text":
        return (
          <input
            type={type}
            placeholder={placeholder}
            className={`px-[10px] w-full py-[10px] border rounded outline-none placeholder:text-[#969696] placeholder:font-[500] text-[#969696] 
              ${error ? "border-red-500 shadow-md shadow-red-500/50 placeholder:text-red-500" : "border-gray-300 hover:border-[#00bbab] focus:border-[#00bbab]"} 
              ${className}`}
            {...register(name, validationSchema)}
          />
        );
      case "checkbox":
        return (
          <div>
            {data.map((d, index) => (
              <div key={index}>
                <input
                  type="checkbox"
                  value={d}
                  name={name}
                  id={`${id}-${index}`}
                  {...register(name)}
                />
                <label htmlFor={`${id}-${index}`}>{d}</label>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mb-4">
      {renderInputField()}
      {error && <p className="font-headerFont text-red-500">{error.message}</p>}
    </div>
  );
};

export default Input;
