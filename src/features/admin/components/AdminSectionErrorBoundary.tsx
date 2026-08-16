"use client";

import { Component, type ReactNode } from "react";

import { Button } from "@/shared/ui/button";

type AdminSectionErrorBoundaryProps = {
  children: ReactNode;
  sectionLabel: string;
};

type AdminSectionErrorBoundaryState = {
  hasError: boolean;
};

/**
 * The route-level `(admin)/error.tsx` boundary is a good last resort, but
 * it replaces the ENTIRE page. A hiccup in one interactive section (a form
 * re-rendering right after its own mutation succeeds, a third-party DOM
 * conflict, ...) shouldn't take down order details / a status history that
 * are still correct and already on screen. Wrap any admin section that
 * mutates data with this — one crash degrades only that section, not the
 * whole page, and the admin can retry without losing their place.
 */
export default class AdminSectionErrorBoundary extends Component<
  AdminSectionErrorBoundaryProps,
  AdminSectionErrorBoundaryState
> {
  state: AdminSectionErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error(`${this.props.sectionLabel} crashed:`, error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-[2rem] border border-border bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground">
            {this.props.sectionLabel} hit a display error. Any action you
            just took was most likely still saved — reload the page to see
            the current state, or try again below.
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-4 rounded-full"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
