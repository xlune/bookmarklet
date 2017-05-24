(function(w){
    if (!w.confirm("応援一括登録を実行しますか？")) {
        return;
    }
    var links = w.document.getElementsByClassName('project-support-link');
    var projectIds = [];
    var successIds = [];
    var faildIds = [];
    [].forEach.call(links, function(el){
        projectIds.push(el.dataset.projectId);
    });
    if (projectIds.length == 0) {
        alert('ERROR: 有効なプロジェクトIDがありません');
        return;
    }
    var csrfToken = '';
    var m = document.getElementsByTagName('meta');
    if ('csrf-token' in m) {
        csrfToken = m['csrf-token'].content || '';
    }
    if (csrfToken == '') {
        alert('ERROR: csrfトークンが取得できませんでした');
        return;
    }
    document.getElementsByTagName('meta')['csrf-token'].content
    projectIds.forEach(function(projectId){
        var xhr = new XMLHttpRequest();
        var param = {
            project_support: {
                message: '',
                project_id: projectId,
                post_to_fb_wall: false,
                post_to_linkedin: false,
                post_to_twitter: false,
                project_variation_id: 0,
            }
        }
        xhr.open('POST', '/projects/' + projectId + '/supports');
        xhr.setRequestHeader('accept', 'application/json, text/plain, */*');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('x-csrf-token', csrfToken);
        xhr.onreadystatechange = function() {
            if(xhr.readyState == 4) {
                if (xhr.status == 200) {
                    successIds.push(projectId);
                } else {
                    faildIds.push(projectId);
                }
                if (projectIds.length === successIds.length + faildIds.length) {
                    alert('成功: ' + successIds.length, '失敗: ' + faildIds.length);
                    w.location.reload();
                }
            }
        }
        xhr.send(JSON.stringify(param));
    });
})(window);
