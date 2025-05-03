import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType(); // 'PUSH', 'POP', 'REPLACE'

  useEffect(() => {
    if (navigationType === "PUSH") {
      // When user clicks a link (new page)
      window.scrollTo(0, 0);
    }
    // If navigationType is "POP" (Back/Forward) ➔ do nothing
  }, [pathname, navigationType]);

  return null;
};

export default ScrollToTop;
