import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

const Input = ({
  name,
  type,
  placeholder,
  error,
  className,
  options,
  data,
  id,
  label,
  methods,
  ...rest
}) => {
  const { register, setValue } = useFormContext();
  const [arrayValue, setArrayValue] = useState("");

  const baseInputClasses =
    "px-[10px] w-full mt-2 py-[10px] border rounded outline-none bg-[#f7f7f7] placeholder:text-gray-600 placeholder:font-[500] text-[#333]";
  const errorClasses =
    "border-red-500 shadow-md shadow-red-500/50 placeholder:text-red-500";
  const normalClasses =
    "border-gray-300 hover:border-[#00bbab] focus:border-[#00bbab] focus:ring-0 focus:outline-none";

  const renderInputField = () => {
    switch (type) {
      case "textarea":
        return (
          <div>
            <label htmlFor={id}>{label}</label>
            <textarea
              id={id}
              placeholder={placeholder}
              className={`${baseInputClasses} ${
                error ? errorClasses : normalClasses
              } ${className}`}
              {...register(name)}
            />
          </div>
        );

      case "file":
        return (
          <div>
            <label htmlFor={id}>{label}</label>
            <input
              type="file"
              id={id}
              accept="video/*,image/*"
              className={`${baseInputClasses} ${
                error ? errorClasses : normalClasses
              } ${className}`}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  if (file.type.startsWith("video/")) {
                    const video = document.createElement("video");
                    video.preload = "metadata";
                    video.onloadedmetadata = () => {
                      window.URL.revokeObjectURL(video.src);
                      const duration = video.duration;
                      console.log(`Video Duration: ${duration} seconds`);
                      setValue(
                        name,
                        { file, duration },
                        { shouldValidate: true }
                      );
                    };
                    video.src = URL.createObjectURL(file);
                  } else {
                    setValue(name, file, { shouldValidate: true });
                  }
                }
              }}
              {...rest}
            />
          </div>
        );

      case "select":
        return (
          <div>
            <label htmlFor={id}>{label}</label>
            <select
              id={id}
              className={`${baseInputClasses} ${
                error ? errorClasses : normalClasses
              } ${className}`}
              {...register(name)}
            >
              {options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case "email":
      case "password":
      case "text":
        return (
          <div>
            <label htmlFor={id}>{label}</label>
            <input
              type={type}
              id={id}
              placeholder={placeholder}
              className={`${baseInputClasses} ${
                error ? errorClasses : normalClasses
              } ${className}`}
              {...register(name)}
            />
          </div>
        );

      case "checkbox":
        return (
          <div>
            {data?.map((d, index) => (
              <div key={index}>
                <input
                  type="checkbox"
                  value={d}
                  id={`${id}-${index}`}
                  {...register(name)}
                />
                <label htmlFor={`${id}-${index}`}>{d}</label>
              </div>
            ))}
          </div>
        );

      case "array":
        return (
          <div>
            <label htmlFor={id}>{label}</label>
            <div className="flex gap-2">
              <input
                type="text"
                id={id}
                value={arrayValue}
                placeholder={placeholder}
                className={`${baseInputClasses} ${
                  error ? errorClasses : normalClasses
                } ${className}`}
                onChange={(e) => setArrayValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const trimmed = arrayValue.trim();
                    if (trimmed) {
                      const current = methods.getValues(name) || [];
                      if (!current.includes(trimmed)) {
                        setValue(name, [...current, trimmed], {
                          shouldValidate: true,
                        });
                      }
                      setArrayValue("");
                    }
                  }
                }}
              />
            </div>
            <div className="mt-2 flex gap-2 flex-wrap">
              {methods.getValues(name)?.map((item, index) => (
                <span
                  key={index}
                  className="bg-[#00bbab] text-white px-2 py-1 rounded cursor-pointer"
                  onClick={() => {
                    const filtered = methods
                      .getValues(name)
                      .filter((_, i) => i !== index);
                    setValue(name, filtered, { shouldValidate: true });
                  }}
                >
                  {item} ✖
                </span>
              ))}
            </div>
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
