(() => {
  document.querySelectorAll("[data-resource-grid]").forEach((root) => {
    const scope=root.parentElement;
    const input=scope?.querySelector("[data-resource-search]");
    if(!input)return;
    const filters=[...scope.querySelectorAll("[data-source-filter]")];
    const reset=scope.querySelector("[data-resource-reset]");
    const empty=scope.querySelector("[data-resource-empty]");
    let source="all";
    const apply=()=>{
      const q=input.value.trim().toLowerCase();let visible=0;
      root.querySelectorAll("[data-resource-card]").forEach(card=>{
        const ok=(source==="all"||card.dataset.source===source)&&(!q||(card.dataset.search||"").includes(q));
        card.hidden=!ok;if(ok)visible++;
      });
      if(empty)empty.hidden=visible!==0;
    };
    filters.forEach(btn=>btn.addEventListener("click",()=>{source=btn.dataset.sourceFilter||"all";filters.forEach(x=>x.classList.toggle("active",x===btn));apply();}));
    input.addEventListener("input",apply);
    reset?.addEventListener("click",()=>{input.value="";source="all";filters.forEach(x=>x.classList.toggle("active",x.dataset.sourceFilter==="all"));apply();});
  });
})();
