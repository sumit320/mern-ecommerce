import React from "react";
import { filterOptions } from "@/config";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

const ProductFilter = ({ filters, handleFilter }) => {
  const keys = Object.keys(filterOptions);

  return (
    <div className="bg-background rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-extrabold tracking-tight">Filters</h2>
      </div>

      {/* Filter Groups */}
      <div className="p-4 space-y-6">
        {keys.map((keyItem, index) => (
          <div key={keyItem} className="space-y-3">
            <h3 className="text-sm font-semibold uppercase text-muted-foreground tracking-wide">
              {keyItem}
            </h3>

            <div className="space-y-2">
              {filterOptions[keyItem].map((option) => (
                <Label
                  key={option.id}
                  className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  <Checkbox
                    checked={
                      filters &&
                      Object.keys(filters).length > 0 &&
                      filters[keyItem] &&
                      filters[keyItem].indexOf(option.id) > -1
                    }
                    onCheckedChange={() => handleFilter(keyItem, option.id)}
                  />
                  <span>{option.label}</span>
                </Label>
              ))}
            </div>

            {/* Separator only if not last group */}
            {index < keys.length - 1 && <Separator />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductFilter;
