import mpl_toolkits.mplot3d
from mmpose.apis import MMPoseInferencer
import os

VIDEO_IN = os.path.expanduser("~/workspace/test_input/user_videos/in_out_frame.mov")
DIR_OUT  = os.path.expanduser("~/workspace/test_output/output/")

inferencer = MMPoseInferencer(pose3d="motionbert_dstformer-ft-243frm_8xb32-120e_h36m")

result_generator = inferencer(inputs=VIDEO_IN, show=False, out_dir=DIR_OUT)
results = list(result_generator)
print("Done! Results saved to:", DIR_OUT)
