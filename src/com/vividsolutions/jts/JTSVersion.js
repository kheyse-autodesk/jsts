function JTSVersion() {
	if (arguments.length === 0) return;
}
module.exports = JTSVersion
JTSVersion.prototype.getMajor = function () {
	return JTSVersion.MAJOR;
};
JTSVersion.prototype.getPatch = function () {
	return JTSVersion.PATCH;
};
JTSVersion.prototype.getMinor = function () {
	return JTSVersion.MINOR;
};
JTSVersion.prototype.toString = function () {
	var ver = JTSVersion.MAJOR + "." + JTSVersion.MINOR + "." + JTSVersion.PATCH;
	if (JTSVersion.releaseInfo !== null && JTSVersion.releaseInfo.length() > 0) return ver + " " + JTSVersion.releaseInfo;
	return ver;
};
JTSVersion.main = function (args) {
	System.out.println(JTSVersion.CURRENT_VERSION);
};
JTSVersion.CURRENT_VERSION = new JTSVersion();
JTSVersion.MAJOR = 1;
JTSVersion.MINOR = 14;
JTSVersion.PATCH = 0;
JTSVersion.releaseInfo = "";

