<h1>Aliyun OSS</h1>


<form role="form" class="form">
	<div class="form-group">
        <label>Aliyun OSS Key</label>
        <input id="aliyun-oss-domain" data-field="aliyun-oss-domain" type="text" class="form-control" placeholder="Enter Aliyun OSS Domain">
        <input id="aliyun-oss-bucket" data-field="aliyun-oss-bucket" type="text" class="form-control" placeholder="Enter Aliyun OSS Bucket">
        <input id="aliyun-oss-accesskeyid" data-field="aliyun-oss-accesskeyid" type="text" class="form-control" placeholder="Enter Aliyun OSS AccessKeyId">
        <input id="aliyun-oss-secretaccesskey" data-field="aliyun-oss-secretaccesskey" type="text" class="form-control" placeholder="Enter Aliyun OSS SecretAccessKey">
    </div>
	<button class="btn btn-lg btn-primary" id="save">Save</button>
</form>

<script type="text/javascript">
	require(['forum/admin/settings'], function(Settings) {
		Settings.prepare();
	});
</script>