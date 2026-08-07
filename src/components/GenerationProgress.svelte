<script lang="ts">
	import type {GenerationStage} from '../lib/generation-stages'

	interface LogEntry {
		timestamp: string
		stage: GenerationStage
		message: string
	}

	let {currentStage, progress, logs}: {
		currentStage: GenerationStage
		progress: number
		logs: LogEntry[]
	} = $props()

	const STAGE_ORDER: GenerationStage[] = [
		'idle',
		'researching',
		'writing-script',
		'generating-speech',
		'mixing-audio',
		'generating-metadata',
		'generating-cover',
		'complete',
	]

	const STAGE_LABELS: Record<GenerationStage, string> = {
		idle: 'IDLE',
		researching: 'RESEARCHING',
		'writing-script': 'WRITING SCRIPT',
		'generating-speech': 'GENERATING SPEECH',
		'mixing-audio': 'MIXING AUDIO',
		'generating-metadata': 'GENERATING METADATA',
		'generating-cover': 'GENERATING COVER',
		complete: 'COMPLETE',
		error: 'ERROR',
	}

	function getStageStatus(stage: GenerationStage): 'completed' | 'active' | 'pending' {
		const currentIndex = STAGE_ORDER.indexOf(currentStage)
		const stageIndex = STAGE_ORDER.indexOf(stage)

		if (stageIndex < currentIndex) return 'completed'
		if (stageIndex === currentIndex) return 'active'
		return 'pending'
	}

	function getStageNumber(stage: GenerationStage): string {
		const index = STAGE_ORDER.indexOf(stage)
		if (index === -1) return ''
		return (index + 1).toString().padStart(2, '0')
	}

	function formatTimestamp(ts: string): string {
		const date = new Date(ts)
		return date.toLocaleTimeString('de-DE', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		})
	}
</script>

<div class="generation-progress">
	<div class="progress-header">
		<h2>═══ GENERATION PIPELINE ═══</h2>
		<div class="overall-progress">
			<span class="progress-label">OVERALL:</span>
			<div class="progress-bar">
				<div class="progress-fill" style="width: {progress}%"></div>
			</div>
			<span class="progress-value">{progress}%</span>
		</div>
	</div>

	<div class="stages-list">
		{#each STAGE_ORDER as stage}
			<div class="stage-item" class:getStageStatus(stage)>
				<div class="stage-indicator">
					{#if getStageStatus(stage) === 'completed'}
						<span class="checkmark">✓</span>
					{:else if getStageStatus(stage) === 'active'}
						<span class="spinner">⟳</span>
					{:else}
						<span class="stage-number">{getStageNumber(stage)}</span>
					{/if}
				</div>
				<div class="stage-info">
					<div class="stage-name">{STAGE_LABELS[stage]}</div>
					<div class="stage-progress-bar">
						<div
							class="stage-progress-fill"
							style="width: {getStageStatus(stage) === 'completed' ? 100 : getStageStatus(stage) === 'active' ? (stage === currentStage ? progress : 0) : 0}%"
						></div>
					</div>
				</div>
			</div>
		{/each}
	</div>

	{#if logs.length > 0}
		<div class="logs-section">
			<h3>═══ LOGS ═══</h3>
			<div class="logs-container">
				{#each logs as log}
					<div class="log-entry">
						<span class="log-time">[{formatTimestamp(log.timestamp)}]</span>
						<span class="log-stage">[{STAGE_LABELS[log.stage]}]</span>
						<span class="log-message">{log.message}</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.generation-progress {
		background: #111111;
		border: 1px solid #003311;
		padding: 1.5rem;
		margin-top: 1rem;
	}

	.progress-header {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1.5rem;
		padding-bottom: 1rem;
		border-bottom: 1px dashed #003311;
	}

	.progress-header h2 {
		font-size: 1rem;
		color: #00ff41;
		text-shadow: 0 0 10px #00ff41;
		margin: 0;
	}

	.overall-progress {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.progress-label {
		color: #00aa2a;
		font-size: 0.75rem;
		min-width: 80px;
	}

	.progress-bar {
		flex: 1;
		height: 8px;
		background: #003311;
		border-radius: 2px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #00ff41, #00aa2a);
		transition: width 0.3s ease;
		box-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
	}

	.progress-value {
		color: #00ff41;
		font-size: 0.875rem;
		min-width: 40px;
		text-align: right;
	}

	.stages-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
	}

	.stage-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem;
		background: #0a0a0a;
		border: 1px solid #003311;
		transition: all 0.2s;
	}

	.stage-item.completed {
		border-color: #00ff41;
		box-shadow: 0 0 10px rgba(0, 255, 65, 0.1);
	}

	.stage-item.active {
		border-color: #00ff41;
		box-shadow: 0 0 15px rgba(0, 255, 65, 0.3);
	}

	.stage-indicator {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		background: #003311;
		border: 1px solid #00ff41;
		border-radius: 50%;
		font-family: inherit;
		font-size: 0.875rem;
		color: #00aa2a;
	}

	.stage-item.completed .stage-indicator {
		background: #00ff41;
		color: #0a0a0a;
	}

	.stage-item.active .stage-indicator {
		background: #003311;
		color: #00ff41;
		animation: pulse 1s ease-in-out infinite;
	}

	.checkmark {
		font-size: 1rem;
	}

	.spinner {
		animation: spin 1s linear infinite;
		display: inline-block;
	}

	.stage-number {
		color: #005511;
	}

	.stage-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.stage-name {
		color: #00ff41;
		font-size: 0.875rem;
		font-weight: bold;
	}

	.stage-item.completed .stage-name {
		color: #00aa2a;
	}

	.stage-progress-bar {
		height: 4px;
		background: #003311;
		border-radius: 2px;
		overflow: hidden;
	}

	.stage-progress-fill {
		height: 100%;
		background: #00ff41;
		transition: width 0.3s ease;
	}

	.logs-section {
		border-top: 1px dashed #003311;
		padding-top: 1rem;
	}

	.logs-section h3 {
		font-size: 0.875rem;
		color: #00ff41;
		margin: 0 0 1rem 0;
	}

	.logs-container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		max-height: 200px;
		overflow-y: auto;
	}

	.log-entry {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		font-size: 0.75rem;
		line-height: 1.4;
		padding: 0.5rem;
		background: #0a0a0a;
		border: 1px solid #002200;
	}

	.log-time {
		color: #005511;
		min-width: 70px;
		font-family: monospace;
	}

	.log-stage {
		color: #00aa2a;
		min-width: 120px;
		font-family: monospace;
		font-size: 0.625rem;
	}

	.log-message {
		color: #00ff41;
		flex: 1;
		word-break: break-word;
	}

	@keyframes pulse {
		0%, 100% { opacity: 0.5; }
		50% { opacity: 1; }
	}

	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}
</style>