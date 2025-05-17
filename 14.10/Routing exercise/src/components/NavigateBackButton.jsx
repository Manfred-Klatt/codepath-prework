import {useNavigate} from "react-router-dom";

import styles from "./NavigateBackButton.module.css";

function NavigateBackButton ()
{
	let navigate = useNavigate();

	return (
		<button
			onClick={() => navigate(-1)}
			className={styles.button}
		>
			Go Back
		</button>
	);
}

export default NavigateBackButton;
