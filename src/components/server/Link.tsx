import React, {
  LinkHTMLAttributes,
  PropsWithChildren,
  ReactNode,
  forwardRef,
} from 'react';
import { default as NextLink } from 'next/link';

const Link = forwardRef(function CustomLink(
  {
    children,
    ...props
  }: PropsWithChildren<
    LinkHTMLAttributes<HTMLAnchorElement> & {
      href: string;
      children: ReactNode;
    }
  >,
  ref
) {
  return process.env.NODE_ENV === 'development' ? (
    <NextLink {...props}>{children}</NextLink>
  ) : (
    <a {...props} ref={ref as any}>
      {children}
    </a>
  );
});

export default Link;
