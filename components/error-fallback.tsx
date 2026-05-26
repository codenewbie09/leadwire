"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ErrorFallbackProps {
  error?: Error;
  reset?: () => void;
}

export default function ErrorFallback({
  error,
  reset,
}: ErrorFallbackProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="size-5 text-destructive" />
            </div>
            <CardTitle>Something went wrong</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            An unexpected error occurred. Please try again or contact support if
            the problem persists.
          </p>
          {error && (
            <details className="group cursor-pointer">
              <summary className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                Error details
              </summary>
              <pre className="mt-2 max-h-32 overflow-auto rounded-lg bg-muted p-3 text-xs text-muted-foreground">
                {error.name}: {error.message}
                {error.stack && (
                  <>
                    {"\n"}
                    {error.stack}
                  </>
                )}
              </pre>
            </details>
          )}
        </CardContent>
        {reset && (
          <CardFooter>
            <Button variant="default" onClick={reset}>
              Try again
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

export { ErrorFallback };
