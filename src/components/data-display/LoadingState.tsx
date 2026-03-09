export function LoadingState() {
  return (
    <div className="flex items-center justify-center h-full min-h-[100px]">
      <span className="text-bloomberg-amber text-sm">
        LOADING<span className="bb-blink">...</span>
      </span>
    </div>
  );
}
