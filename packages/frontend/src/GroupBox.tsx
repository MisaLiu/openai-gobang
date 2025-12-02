import { memo } from 'preact/compat';
import type { VNode } from 'preact';

interface GroupBoxProps {
  children: VNode
  title?: string;
};

const GroupBox = ({
  children,
  title,
}: GroupBoxProps) => {
  return (
    <fieldset class="groupbox">
      {title && (
        <legend>{title}</legend>
      )}
      {children}
    </fieldset>
  )
};

export default memo(GroupBox);
