"use client";

import { QUOTE_QUERY_KEY } from "@/hooks/quote";
import { cn } from "@/lib/utils";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { RotateCcw } from "lucide-react";
import React from "react";

const QuoteRefetchButton = () => {
  const fetches = useIsFetching({ queryKey: [QUOTE_QUERY_KEY] });
  const isFetching = fetches > 0;

  const queryClient = useQueryClient();

  // Using this cause there is only one place the quote query is used in this app
  const allQuoteQueries = queryClient.getQueryCache().findAll({
    queryKey: [QUOTE_QUERY_KEY],
  });

  const handleClick = () => {
    queryClient.invalidateQueries({ queryKey: [QUOTE_QUERY_KEY] });
  };

  if (allQuoteQueries.length === 0) return null;

  return (
    <button
      className="bg-transparent h-9 w-9 flex items-center justify-center border-none cursor-pointer text-text-primary"
      type="button"
      onClick={handleClick}
      disabled={isFetching}
    >
      <RotateCcw
        className={cn("size-5 text-bungee-gold ", {
          "animate-spin": isFetching,
        })}
      />
    </button>
  );
};

export default QuoteRefetchButton;
