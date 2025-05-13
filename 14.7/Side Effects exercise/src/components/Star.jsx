import {useEffect, useRef} from "react";

import styles from "./Star.module.css";

function Star ({id, position, destroyStar})
{
	const starRef = useRef(null);

	useEffect(() =>
	          {
		          const star = starRef.current;
		          star.focus();
	          }, []);

	function handleClick (event)
	{
		destroyStar(id);
	}

	return (
		<div
			ref={starRef}
			tabIndex="0"
			onClick={handleClick}
			style={{left: position.x, top: position.y}}
			className={styles.star}
		>&#9733;</div>
	);
}

export default Star;
