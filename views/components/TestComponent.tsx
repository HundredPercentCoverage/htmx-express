import React from "react";

interface Props {
  name: string;
}

const TestComponent: React.FC<Props> = ({ name }) => {
  return (
    <div>
      <p>This is a test component</p>
      <p>Name prop is {name}</p>
    </div>
  );
};

export default TestComponent;
