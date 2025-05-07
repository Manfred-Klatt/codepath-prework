import styles from "./MissionFilter.module.css";

function MissionFilter ({setFilter})
{
	const STATUSES = ["All", "Planned", "Active", "Completed"];

	return (
		<>
			{
				STATUSES.map((status, index) => (
					<button
						key={index}
						onClick={() => setFilter(status)}
						className={styles.button}
					>
						{status}
					</button>
				))
			}
		</>
	);
}

export default MissionFilter;
