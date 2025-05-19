import React from "react";


interface InlineLoadingProps {
  className: string;
  color?: string;
  center?: boolean,
}

const InlineLoading: React.FC<InlineLoadingProps> = (props) => {
  let className = "lds-ellipsis ";
  if (props.className) className += props.className;

  const el = (
    <div className={className}>
      <div className={`lds-ellipsis--${props.color}`}></div>
      <div className={`lds-ellipsis--${props.color}`}></div>
      <div className={`lds-ellipsis--${props.color}`}></div>
      <div className={`lds-ellipsis--${props.color}`}></div>
    </div>
  );

  if (props.center) {
    return <div className="u-text-center">{el}</div>;
  } else return el;
};

export default InlineLoading;
