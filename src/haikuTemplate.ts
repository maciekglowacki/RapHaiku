export const haikuTemplate = (haiku : Array<string>, photoUrl : string) =>
`
<p>"${haiku[0]}</p>
<p>${haiku[1]}</p>
<p>${haiku[2]}"</p>
<div class="artist-info">
    <img src="${photoUrl}" alt="face" />
</div>`;
