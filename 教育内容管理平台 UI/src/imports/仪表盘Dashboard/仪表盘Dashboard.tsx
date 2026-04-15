import svgPaths from "./svg-raqljneyvr";
import imgUserProfile from "./2503296d0ef148993812106d7a453c4e10597a1d.png";
import imgAb6AXuCyYZtM4DPnGbxQtez6W8MZpgjAmuYrqITvKdcUf0Vh49PeTNd2HxT1DnSqRlMo1PQo0BF0X5Kw6RHbfOhmG7QbRgad3StLKdX9VCqa7Uft2JbphglEt9EtB4UcqYw3DwwrZrDvIeo41Al7JCFoDFmLqdReususKb3WkKcwoCnaRu1LSG5Z6PJjwBMwRQoH5Z30M0Nh4JkVoQ8Tp5SRepcI5LqF8Rbe9DQdQlKaM3Dr7T9Fqz0OfUpNi57Inhbo from "./3f531c37c86be6d25dccccca9f99685c7461c1dd.png";
import imgAb6AXuCnWKflB25QBbxuRq1DErTnt7B0IWUbwXGrgaAr91NowQDx28DvOcgfR62Oz7QBjDsFukuvFzdxaFTkaxThdb8EbqNp4V5Oh38WwcF6MDowywLhc3DGoONgKrh4LrvLf1TVRnRx8RFtVq6O9BfsEAq0BLzwmOqXhDcebu55Dy6MVnPaqBex6OUvVyvGub3CLxnc2XyXaGLot2Fx2YoVv2Pv2MduEykBjNw8YByvhIgkkpDiRsOchRitp9Nku0Z32Powk2Rju4 from "./3854f4b76248f59a8bcbc1af043c15c75fe172f7.png";
import imgAb6AXuBj8VJvhsllI1JU3Txx7Ad4Ut2LJpw5YpVl4JGmBJqy5Xy8FeCAhbhBqXunhTgHfo2FSdkxDebyAPf2WqtHj75J8Yq4Mv4FW07WilnVtFBFpyb7XEKwLepu905SUa73ITqD7M8Vvez48J4Msru5LJfj7UleasoxFuY8QAYx60Gd0WkaC6PeRan7Py1CVjo3LS2C36M5N6IaM8CbExDsAoes2T3C8ZlgI81Vix1CKsNj5KaThRkfOqlDqjpxcipw6HlXc from "./4e56177e13537bc134b15df37d254d5ddfcbe013.png";
import imgAb6AXuBpsetJmHs64EdgScpNwtAeAbNsO0Ow7LXtQBdcAakBoilzaXem187L2YRPzZoRylemrqLWcTgIeHopEERhg3GpKaJ5W1Q5APRm6VnHvtdj2TbDjuqt6PIAlvW92IQt6WhV7VUrcFaEahZfLiNzzU4Ugf8Im5LEpO7QW5T7YXyvTtAxnZkrWk2XBiNLuoQ6SaigQ0NuJyrQtWKssLhZC411ZRvIDoscK901Rz6CLy4EB0IknbTw9AFzQFeZTpksrKc from "./b9cc85e3196ffccac91c7b08b0a2423fc96d4506.png";
import imgAb6AXuCmj3HCxa8VpxYlmChtTcLyKq2RXKlvkC2PijmLu2VizpAXtbOphO2ZvYDuqfnfzUKdsnwq3UsCrCs3PhWyj0Fa3LoeT6TBbbXvjpcSvoshAuNbKEfi6So6M1N5KuaXwwAqhOzHrC2Skzg4HFqosCxSitAyfvMRvguB7H8D7Gjt2RX9Rpj6VQbTeiGhrH2TnOym4UhcPDgax0Oyue7J9LEi61Uzs5ArWcusiZpqWLwBknFs2WJZpfJnNK0Df7A38UZag from "./a4d8039e8162f1bf06c280d302c08242088969d3.png";

function Container1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#1d4ed8] text-[20px] whitespace-nowrap">
        <p className="leading-[28px]">The Inspired Academy</p>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[6px] relative shrink-0" data-name="Link">
      <div aria-hidden="true" className="absolute border-[#2563eb] border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#1d4ed8] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Dashboard</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Link">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#475569] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Courses</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Link">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#475569] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Library</p>
      </div>
    </div>
  );
}

function Nav() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0" data-name="Nav">
      <Link />
      <Link1 />
      <Link2 />
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex gap-[32px] items-center relative shrink-0" data-name="Container">
      <Container1 />
      <Nav />
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-[24px] py-[8px] relative rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0" style={{ backgroundImage: "linear-gradient(166.56deg, rgb(0, 88, 190) 0%, rgb(33, 112, 228) 100%)" }} data-name="Button">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">
        <p className="leading-[20px]">Create Content</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[36px] relative shrink-0 w-[32px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 36">
        <g id="Container">
          <path d={svgPaths.p121cc980} fill="var(--fill-0, #475569)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container5() {
  return (
    <div className="relative shrink-0 size-[36px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 36">
        <g id="Container">
          <path d={svgPaths.p1988dd00} fill="var(--fill-0, #475569)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex gap-[7.99px] items-center relative shrink-0" data-name="Container">
      <Container4 />
      <Container5 />
    </div>
  );
}

function UserProfile() {
  return (
    <div className="pointer-events-none relative rounded-[9999px] shrink-0 size-[40px]" data-name="User profile">
      <div className="absolute inset-0 overflow-hidden rounded-[9999px]">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgUserProfile} />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[#d3e4fe] border-solid inset-0 rounded-[9999px]" />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Container">
      <Button />
      <Container3 />
      <UserProfile />
    </div>
  );
}

function HeaderTopNavBar() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(255,255,255,0.6)] relative shrink-0 w-full z-[2]" data-name="Header - TopNavBar">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[32px] py-[12px] relative size-full">
          <Container />
          <Container2 />
        </div>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[18px] relative shrink-0 w-[22px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 18">
        <g id="Container">
          <path d={svgPaths.p3dd55c80} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#0058be] content-stretch flex h-[40px] items-center justify-center relative rounded-[12px] shrink-0 w-[39.47px]" data-name="Background">
      <Container8 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="flex flex-col font-['Manrope:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[#1d4ed8] text-[18px] whitespace-nowrap">
        <p className="leading-[22.5px] mb-0">Inspired</p>
        <p className="leading-[22.5px]">Academy</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[10px] tracking-[1px] uppercase whitespace-nowrap">
        <p className="leading-[15px]">CURATOR WORKSPACE</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[131.31px]" data-name="Container">
      <Heading1 />
      <Container10 />
    </div>
  );
}

function Container7() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[8px] py-[24px] relative size-full">
          <Background />
          <Container9 />
        </div>
      </div>
    </div>
  );
}

function Margin() {
  return (
    <div className="relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[16px] relative size-full">
        <Container7 />
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p20793584} fill="var(--fill-0, #1D4ED8)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#1d4ed8] text-[12px] tracking-[1.2px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">DASHBOARD</p>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="absolute bg-[#eff6ff] content-stretch flex gap-[12px] items-center left-[4px] px-[16px] py-[12px] right-[-4px] rounded-[8px] top-0" data-name="Link">
      <Container11 />
      <Container12 />
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[22px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 19.5">
        <g id="Container">
          <path d={svgPaths.p1382b180} fill="var(--fill-0, #64748B)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#64748b] text-[12px] tracking-[1.2px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">COURSE MATERIALS</p>
      </div>
    </div>
  );
}

function Link4() {
  return (
    <div className="absolute content-stretch flex gap-[12px] items-center left-0 px-[16px] py-[12px] right-0 rounded-[8px] top-[52px]" data-name="Link">
      <Container13 />
      <Container14 />
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[16px] relative shrink-0 w-[22px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 16">
        <g id="Container">
          <path d={svgPaths.p39955c80} fill="var(--fill-0, #64748B)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#64748b] text-[12px] tracking-[1.2px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">STUDENT ASSETS</p>
      </div>
    </div>
  );
}

function Link5() {
  return (
    <div className="absolute content-stretch flex gap-[12px] items-center left-0 px-[16px] py-[12px] right-0 rounded-[8px] top-[104px]" data-name="Link">
      <Container15 />
      <Container16 />
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[16px] relative shrink-0 w-[20px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 16">
        <g id="Container">
          <path d={svgPaths.p38dba880} fill="var(--fill-0, #64748B)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#64748b] text-[12px] tracking-[1.2px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">METADATA</p>
      </div>
    </div>
  );
}

function Link6() {
  return (
    <div className="absolute content-stretch flex gap-[12px] items-center left-0 px-[16px] py-[12px] right-0 rounded-[8px] top-[156px]" data-name="Link">
      <Container17 />
      <Container18 />
    </div>
  );
}

function Nav1() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="Nav">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Link3 />
        <Link4 />
        <Link5 />
        <Link6 />
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#001a42] text-[12px] w-full">
        <p className="leading-[16px]">Power User</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center py-[8px] relative rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 w-full" data-name="Button">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0058be] text-[10px] text-center uppercase whitespace-nowrap">
        <p className="leading-[15px]">UPGRADE PLAN</p>
      </div>
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#d8e2ff] relative rounded-[12px] shrink-0 w-full" data-name="Background">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start p-[16px] relative size-full">
        <Container19 />
        <Button1 />
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="h-[20px] relative shrink-0 w-[20.1px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.1 20">
        <g id="Container">
          <path d={svgPaths.p3cdadd00} fill="var(--fill-0, #64748B)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#64748b] text-[12px] tracking-[1.2px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">SETTINGS</p>
      </div>
    </div>
  );
}

function Link7() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center pb-[8px] pt-[20px] px-[16px] relative size-full">
          <Container20 />
          <Container21 />
        </div>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="h-[20px] relative shrink-0 w-[17px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 20">
        <g id="Container">
          <path d={svgPaths.p2d9a1e80} fill="var(--fill-0, #64748B)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#64748b] text-[12px] tracking-[1.2px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">SUPPORT</p>
      </div>
    </div>
  );
}

function Link8() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center px-[16px] py-[8px] relative size-full">
          <Container22 />
          <Container23 />
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[#f1f5f9] border-solid border-t inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start pt-[17px] relative size-full">
        <Background1 />
        <Link7 />
        <Link8 />
      </div>
    </div>
  );
}

function AsideSideNavBar() {
  return (
    <div className="bg-[#f8fafc] content-stretch flex flex-col h-[1093px] items-start pl-[16px] pr-[17px] py-[16px] relative shrink-0 w-[256px]" data-name="Aside - SideNavBar">
      <div aria-hidden="true" className="absolute border-[#f1f5f9] border-r border-solid inset-0 pointer-events-none" />
      <Margin />
      <Nav1 />
      <HorizontalBorder />
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#0058be] text-[12px] tracking-[0.6px] uppercase w-full">
        <p className="leading-[18px]">CURATOR WORKSPACE</p>
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 1">
      <div className="flex flex-col font-['Manrope:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[#0b1c30] text-[36px] tracking-[-0.9px] w-full">
        <p className="leading-[45px]">Welcome back, Dr. Julian.</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-[672px] relative shrink-0 w-[672px]" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#424754] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">{`Your academy's knowledge ecosystem is thriving. Here is your curation report for today.`}</p>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Header">
      <Container24 />
      <Heading />
      <Container25 />
    </div>
  );
}

function Container26() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[12px] tracking-[1.2px] uppercase w-full">
          <p className="leading-[18px]">STORAGE USED</p>
        </div>
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[12px] relative size-full">
        <div className="flex flex-col font-['Manrope:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[#0b1c30] text-[30px] w-full">
          <p className="leading-[36px]">85%</p>
        </div>
      </div>
    </div>
  );
}

function Background2() {
  return (
    <div className="bg-[#eff4ff] h-[8px] relative rounded-[9999px] shrink-0 w-full" data-name="Background">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <div className="absolute bg-[#b75b00] inset-[0_15.01%_0_0] rounded-[9999px]" data-name="Background" />
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[4px] relative size-full">
        <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[10px] w-full">
          <p className="leading-[15px]">42.5 GB of 50 GB</p>
        </div>
      </div>
    </div>
  );
}

function StorageUsed() {
  return (
    <div className="bg-white col-3 justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Storage Used">
      <div aria-hidden="true" className="absolute border-[#924700] border-solid border-t-4 inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start pb-[25px] pt-[28px] px-[24px] relative size-full">
        <Container26 />
        <Heading2 />
        <Background2 />
        <Container27 />
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[12px] tracking-[1.2px] uppercase w-full">
          <p className="leading-[18px]">PENDING REVIEWS</p>
        </div>
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Manrope:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[#0b1c30] text-[30px] w-full">
          <p className="leading-[36px]">12</p>
        </div>
      </div>
    </div>
  );
}

function Ab6AXuCyYZtM4DPnGbxQtez6W8MZpgjAmuYrqITvKdcUf0Vh49PeTNd2HxT1DnSqRlMo1PQo0BF0X5Kw6RHbfOhmG7QbRgad3StLKdX9VCqa7Uft2JbphglEt9EtB4UcqYw3DwwrZrDvIeo41Al7JCFoDFmLqdReususKb3WkKcwoCnaRu1LSG5Z6PJjwBMwRQoH5Z30M0Nh4JkVoQ8Tp5SRepcI5LqF8Rbe9DQdQlKaM3Dr7T9Fqz0OfUpNi57Inhbo() {
  return (
    <div className="max-w-[166px] mr-[-12px] pointer-events-none relative rounded-[9999px] shrink-0 size-[32px]" data-name="AB6AXuCy_yZt-M4dPN_gbxQtez6W8MZpgjAMUYrqITvKdcUf0-vh49pe_tNd2hxT1dnSQRlMo1PQo0bF0x5_Kw6rHbfOHM-_G7QbRGAD3StLKdX9vCQA7-UFT2jbphglET9etB4ucqYw3dwwr_ZrDvIEO41al7jCFoDFmLqdReususKb_3WKKcwoCNARu1L_sG5Z__6PJjwBMwRQoH5z3-0M0NH4JkVoQ8tp5SRepcI5lqF8rbe9dQdQlKaM3dr7T9fqz0OFUpNI57Inhbo">
      <div className="absolute inset-0 overflow-hidden rounded-[9999px]">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgAb6AXuCyYZtM4DPnGbxQtez6W8MZpgjAmuYrqITvKdcUf0Vh49PeTNd2HxT1DnSqRlMo1PQo0BF0X5Kw6RHbfOhmG7QbRgad3StLKdX9VCqa7Uft2JbphglEt9EtB4UcqYw3DwwrZrDvIeo41Al7JCFoDFmLqdReususKb3WkKcwoCnaRu1LSG5Z6PJjwBMwRQoH5Z30M0Nh4JkVoQ8Tp5SRepcI5LqF8Rbe9DQdQlKaM3Dr7T9Fqz0OfUpNi57Inhbo} />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 rounded-[9999px]" />
    </div>
  );
}

function Ab6AXuCnWKflB25QBbxuRq1DErTnt7B0IWUbwXGrgaAr91NowQDx28DvOcgfR62Oz7QBjDsFukuvFzdxaFTkaxThdb8EbqNp4V5Oh38WwcF6MDowywLhc3DGoONgKrh4LrvLf1TVRnRx8RFtVq6O9BfsEAq0BLzwmOqXhDcebu55Dy6MVnPaqBex6OUvVyvGub3CLxnc2XyXaGLot2Fx2YoVv2Pv2MduEykBjNw8YByvhIgkkpDiRsOchRitp9Nku0Z32Powk2Rju() {
  return (
    <div className="max-w-[166px] pointer-events-none relative rounded-[9999px] shrink-0 size-[32px]" data-name="AB6AXuCnWKflB25Q-bbxuRq1dErTNT7B0iWUbwXGrgaAR91nowQ-dx28dvOcgfR62Oz7qBjDSFukuvFzdxaFTkaxThdb8EBQNp4V5Oh38-wwcF6mDOWYWLhc3dGoONgKrh4LRVLf1tVRnRX8rFtVQ6o9bfsEAq0bLZWMOqXhDCEBU55DY6MVnPaqBex6oUvVYV-Gub3cLxnc2XYXaGLot2Fx2yoVv2PV2MduEykBjNW8YByvhIGKKPDiRsOCHRitp9-nku0Z32POWK2Rju4">
      <div className="absolute inset-0 overflow-hidden rounded-[9999px]">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgAb6AXuCnWKflB25QBbxuRq1DErTnt7B0IWUbwXGrgaAr91NowQDx28DvOcgfR62Oz7QBjDsFukuvFzdxaFTkaxThdb8EbqNp4V5Oh38WwcF6MDowywLhc3DGoONgKrh4LrvLf1TVRnRx8RFtVq6O9BfsEAq0BLzwmOqXhDcebu55Dy6MVnPaqBex6OUvVyvGub3CLxnc2XyXaGLot2Fx2YoVv2Pv2MduEykBjNw8YByvhIgkkpDiRsOchRitp9Nku0Z32Powk2Rju4} />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 rounded-[9999px]" />
    </div>
  );
}

function ImgMargin() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-[154px] mr-[-12px] relative shrink-0 size-[32px]" data-name="Img:margin">
      <Ab6AXuCnWKflB25QBbxuRq1DErTnt7B0IWUbwXGrgaAr91NowQDx28DvOcgfR62Oz7QBjDsFukuvFzdxaFTkaxThdb8EbqNp4V5Oh38WwcF6MDowywLhc3DGoONgKrh4LrvLf1TVRnRx8RFtVq6O9BfsEAq0BLzwmOqXhDcebu55Dy6MVnPaqBex6OUvVyvGub3CLxnc2XyXaGLot2Fx2YoVv2Pv2MduEykBjNw8YByvhIgkkpDiRsOchRitp9Nku0Z32Powk2Rju />
    </div>
  );
}

function Ab6AXuBj8VJvhsllI1JU3Txx7Ad4Ut2LJpw5YpVl4JGmBJqy5Xy8FeCAhbhBqXunhTgHfo2FSdkxDebyAPf2WqtHj75J8Yq4Mv4FW07WilnVtFBFpyb7XEKwLepu905SUa73ITqD7M8Vvez48J4Msru5LJfj7UleasoxFuY8QAYx60Gd0WkaC6PeRan7Py1CVjo3LS2C36M5N6IaM8CbExDsAoes2T3C8ZlgI81Vix1CKsNj5KaThRkfOqlDqjpxcipw6HlXc() {
  return (
    <div className="max-w-[166px] pointer-events-none relative rounded-[9999px] shrink-0 size-[32px]" data-name="AB6AXuBJ_8vJvhsllI1jU3txx-7Ad4UT2lJpw-5ypVL4JGmB_JQY5Xy8feCAhbhBqXUNHTgHfo2F_SDKXDebyAPf2_WQTHj75j8yq4Mv4fW07WilnVtF-bFpyb7xEKwLEPU905SUa73i_tqD7m8Vvez48-j4MSRU5lJfj7uleasoxFuY8qAYx60GD-0WkaC6peRan7PY1cVJO3lS2c36m5N6IaM8CbEXDsAOES2T3C8zlgI81VIX1cKsNJ5kaThRkfOQLDqjpxcipw6HLXc">
      <div className="absolute inset-0 overflow-hidden rounded-[9999px]">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgAb6AXuBj8VJvhsllI1JU3Txx7Ad4Ut2LJpw5YpVl4JGmBJqy5Xy8FeCAhbhBqXunhTgHfo2FSdkxDebyAPf2WqtHj75J8Yq4Mv4FW07WilnVtFBFpyb7XEKwLepu905SUa73ITqD7M8Vvez48J4Msru5LJfj7UleasoxFuY8QAYx60Gd0WkaC6PeRan7Py1CVjo3LS2C36M5N6IaM8CbExDsAoes2T3C8ZlgI81Vix1CKsNj5KaThRkfOqlDqjpxcipw6HlXc} />
      </div>
      <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 rounded-[9999px]" />
    </div>
  );
}

function ImgMargin1() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-[154px] mr-[-12px] relative shrink-0 size-[32px]" data-name="Img:margin">
      <Ab6AXuBj8VJvhsllI1JU3Txx7Ad4Ut2LJpw5YpVl4JGmBJqy5Xy8FeCAhbhBqXunhTgHfo2FSdkxDebyAPf2WqtHj75J8Yq4Mv4FW07WilnVtFBFpyb7XEKwLepu905SUa73ITqD7M8Vvez48J4Msru5LJfj7UleasoxFuY8QAYx60Gd0WkaC6PeRan7Py1CVjo3LS2C36M5N6IaM8CbExDsAoes2T3C8ZlgI81Vix1CKsNj5KaThRkfOqlDqjpxcipw6HlXc />
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-[#f1f5f9] content-stretch flex items-center justify-center pb-[9px] pt-[8px] px-[2px] relative rounded-[9999px] shrink-0 size-[32px]" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 pointer-events-none rounded-[9999px]" />
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[10px] text-center whitespace-nowrap">
        <p className="leading-[15px]">+9</p>
      </div>
    </div>
  );
}

function Margin1() {
  return (
    <div className="content-stretch flex flex-col items-start mr-[-12px] relative shrink-0 size-[32px]" data-name="Margin">
      <BackgroundBorder />
    </div>
  );
}

function Container29() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start pr-[12px] pt-[12px] relative size-full">
        <Ab6AXuCyYZtM4DPnGbxQtez6W8MZpgjAmuYrqITvKdcUf0Vh49PeTNd2HxT1DnSqRlMo1PQo0BF0X5Kw6RHbfOhmG7QbRgad3StLKdX9VCqa7Uft2JbphglEt9EtB4UcqYw3DwwrZrDvIeo41Al7JCFoDFmLqdReususKb3WkKcwoCnaRu1LSG5Z6PJjwBMwRQoH5Z30M0Nh4JkVoQ8Tp5SRepcI5LqF8Rbe9DQdQlKaM3Dr7T9Fqz0OfUpNi57Inhbo />
        <ImgMargin />
        <ImgMargin1 />
        <Margin1 />
      </div>
    </div>
  );
}

function PendingReviews() {
  return (
    <div className="bg-white col-4 justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Pending Reviews">
      <div aria-hidden="true" className="absolute border-[#006c49] border-solid border-t-4 inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start pb-[24px] pt-[28px] px-[24px] relative size-full">
        <Container28 />
        <Heading3 />
        <Container29 />
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[12px] tracking-[1.2px] uppercase w-full">
        <p className="leading-[18px]">TOTAL COURSES</p>
      </div>
    </div>
  );
}

function Heading4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="flex flex-col font-['Manrope:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[#0b1c30] text-[30px] w-full">
        <p className="leading-[36px]">24</p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="h-[7px] relative shrink-0 w-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 7">
        <g id="Container">
          <path d={svgPaths.pde19380} fill="var(--fill-0, #006C49)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container34() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#006c49] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">+2 this month</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex gap-[8px] items-center pt-[12px] relative shrink-0 w-full" data-name="Container">
      <Container33 />
      <Container34 />
    </div>
  );
}

function Container30() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Container31 />
        <Heading4 />
        <Container32 />
      </div>
    </div>
  );
}

function TotalCourses() {
  return (
    <div className="bg-white col-1 justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Total Courses">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pb-[36px] pt-[28px] px-[24px] relative size-full">
          <Container30 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#0058be] border-solid border-t-4 inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Container35() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[12px] tracking-[1.2px] uppercase w-full">
          <p className="leading-[18px]">ACTIVE STUDENTS</p>
        </div>
      </div>
    </div>
  );
}

function Heading5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Manrope:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[#0b1c30] text-[30px] w-full">
          <p className="leading-[36px]">1,842</p>
        </div>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="h-[9.333px] relative shrink-0 w-[12.833px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.8333 9.33333">
        <g id="Container">
          <path d={svgPaths.p1d3af800} fill="var(--fill-0, #006C49)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container38() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#006c49] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Engagement +12%</p>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center pt-[12px] relative size-full">
        <Container37 />
        <Container38 />
      </div>
    </div>
  );
}

function ActiveStudents() {
  return (
    <div className="bg-white col-2 justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Active Students">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-start pb-[36px] pt-[28px] px-[24px] relative size-full">
          <Container35 />
          <Heading5 />
          <Container36 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#0058be] border-solid border-t-4 inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function SummaryBentoGrid() {
  return (
    <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-[repeat(4,minmax(0,1fr))] grid-rows-[_158px] relative shrink-0 w-full" data-name="Summary Bento Grid">
      <StorageUsed />
      <PendingReviews />
      <TotalCourses />
      <ActiveStudents />
    </div>
  );
}

function Heading6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Heading 2">
      <div className="flex flex-col font-['Manrope:ExtraBold',sans-serif] font-extrabold justify-center leading-[0] relative shrink-0 text-[#0b1c30] text-[24px] tracking-[-0.6px] whitespace-nowrap">
        <p className="leading-[32px]">Recently Modified Materials</p>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0" data-name="Button">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0058be] text-[12px] text-center tracking-[1.2px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">VIEW ALL LIBRARY</p>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Heading6 />
      <Button2 />
    </div>
  );
}

function Container42() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Container">
          <path d={svgPaths.p3e330400} fill="var(--fill-0, #0058BE)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background3() {
  return (
    <div className="bg-[#d8e2ff] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[48px]" data-name="Background">
      <Container42 />
    </div>
  );
}

function Heading7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 4">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#0b1c30] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Advanced Micro-Biology Lecture 04</p>
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#424754] text-[12px] tracking-[0.6px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">VIDEO COURSE • MODIFIED 2H AGO</p>
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[274.44px]" data-name="Container">
      <Heading7 />
      <Container44 />
    </div>
  );
}

function Container41() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Container">
      <Background3 />
      <Container43 />
    </div>
  );
}

function Container47() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[12px] text-right whitespace-nowrap">
        <p className="leading-[16px]">428 MB</p>
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[10px] text-right uppercase whitespace-nowrap">
        <p className="leading-[15px]">4K HIGH-RES</p>
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[64.47px]" data-name="Container">
      <Container47 />
      <Container48 />
    </div>
  );
}

function Container49() {
  return (
    <div className="h-[16px] relative shrink-0 w-[4px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 16">
        <g id="Container">
          <path d={svgPaths.p3caf0c80} fill="var(--fill-0, #94A3B8)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[8px] relative shrink-0" data-name="Button">
      <Container49 />
    </div>
  );
}

function Container45() {
  return (
    <div className="content-stretch flex gap-[23.99px] items-center relative shrink-0" data-name="Container">
      <Container46 />
      <Button3 />
    </div>
  );
}

function MaterialItem() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="Material Item 1">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[16px] relative size-full">
          <Container41 />
          <Container45 />
        </div>
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="h-[20px] relative shrink-0 w-[16px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 20">
        <g id="Container">
          <path d={svgPaths.pc679c40} fill="var(--fill-0, #006C49)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Overlay() {
  return (
    <div className="bg-[rgba(108,248,187,0.3)] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[48px]" data-name="Overlay">
      <Container51 />
    </div>
  );
}

function Heading8() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 4">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#0b1c30] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Curation Guidelines 2024.pdf</p>
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#424754] text-[12px] tracking-[0.6px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">DOCUMENTATION • MODIFIED 5H AGO</p>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[245.23px]" data-name="Container">
      <Heading8 />
      <Container53 />
    </div>
  );
}

function Container50() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Container">
      <Overlay />
      <Container52 />
    </div>
  );
}

function Container56() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[12px] text-right whitespace-nowrap">
        <p className="leading-[16px]">2.4 MB</p>
      </div>
    </div>
  );
}

function Container57() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[10px] text-right uppercase whitespace-nowrap">
        <p className="leading-[15px]">PDF DOCUMENT</p>
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[80.97px]" data-name="Container">
      <Container56 />
      <Container57 />
    </div>
  );
}

function Container58() {
  return (
    <div className="h-[16px] relative shrink-0 w-[4px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 16">
        <g id="Container">
          <path d={svgPaths.p3caf0c80} fill="var(--fill-0, #94A3B8)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[8px] relative shrink-0" data-name="Button">
      <Container58 />
    </div>
  );
}

function Container54() {
  return (
    <div className="content-stretch flex gap-[23.99px] items-center relative shrink-0" data-name="Container">
      <Container55 />
      <Button4 />
    </div>
  );
}

function MaterialItem1() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="Material Item 2">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[16px] relative size-full">
          <Container50 />
          <Container54 />
        </div>
      </div>
    </div>
  );
}

function Container60() {
  return (
    <div className="h-[18.95px] relative shrink-0 w-[22px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 18.95">
        <g id="Container">
          <path d={svgPaths.p2166ad00} fill="var(--fill-0, #924700)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background4() {
  return (
    <div className="bg-[#ffdcc6] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[48px]" data-name="Background">
      <Container60 />
    </div>
  );
}

function Heading9() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 4">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#0b1c30] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Ethics in AI - Podcast Interview</p>
      </div>
    </div>
  );
}

function Container62() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#424754] text-[12px] tracking-[0.6px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">AUDIO ASSET • MODIFIED 1D AGO</p>
      </div>
    </div>
  );
}

function Container61() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[237.31px]" data-name="Container">
      <Heading9 />
      <Container62 />
    </div>
  );
}

function Container59() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Container">
      <Background4 />
      <Container61 />
    </div>
  );
}

function Container65() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[12px] text-right whitespace-nowrap">
        <p className="leading-[16px]">18.5 MB</p>
      </div>
    </div>
  );
}

function Container66() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[10px] text-right uppercase whitespace-nowrap">
        <p className="leading-[15px]">MP3 STUDIO</p>
      </div>
    </div>
  );
}

function Container64() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[62.23px]" data-name="Container">
      <Container65 />
      <Container66 />
    </div>
  );
}

function Container67() {
  return (
    <div className="h-[16px] relative shrink-0 w-[4px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 16">
        <g id="Container">
          <path d={svgPaths.p3caf0c80} fill="var(--fill-0, #94A3B8)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[8px] relative shrink-0" data-name="Button">
      <Container67 />
    </div>
  );
}

function Container63() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0" data-name="Container">
      <Container64 />
      <Button5 />
    </div>
  );
}

function MaterialItem2() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="Material Item 3">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[16px] relative size-full">
          <Container59 />
          <Container63 />
        </div>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <MaterialItem />
      <MaterialItem1 />
      <MaterialItem2 />
    </div>
  );
}

function Section() {
  return (
    <div className="bg-[#eff4ff] relative rounded-[12px] shrink-0 w-full" data-name="Section">
      <div className="content-stretch flex flex-col gap-[32px] items-start p-[32px] relative size-full">
        <Container39 />
        <Container40 />
      </div>
    </div>
  );
}

function MainActivityFeed() {
  return (
    <div className="col-[1/span_2] content-stretch flex flex-col items-start justify-self-stretch pb-[240px] relative row-1 self-start shrink-0" data-name="Main Activity Feed (2/3)">
      <Section />
    </div>
  );
}

function Heading10() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#0b1c30] text-[20px] w-full">
        <p className="leading-[28px]">Student Submissions</p>
      </div>
    </div>
  );
}

function Ab6AXuBpsetJmHs64EdgScpNwtAeAbNsO0Ow7LXtQBdcAakBoilzaXem187L2YRPzZoRylemrqLWcTgIeHopEERhg3GpKaJ5W1Q5APRm6VnHvtdj2TbDjuqt6PIAlvW92IQt6WhV7VUrcFaEahZfLiNzzU4Ugf8Im5LEpO7QW5T7YXyvTtAxnZkrWk2XBiNLuoQ6SaigQ0NuJyrQtWKssLhZC411ZRvIDoscK901Rz6CLy4EB0IknbTw9AFzQFeZTpksrKc() {
  return (
    <div className="max-w-[224px] relative rounded-[9999px] shrink-0 size-[40px]" data-name="AB6AXuBPSETJmHs64EdgSCPNwtAeAbNsO0Ow7lXtQBdcAakBoilza_Xem187L2yRPzZORylemrqLWcTGIeHOP_eERhg3gpKaJ5W1Q5aPRm_6VnHVTDJ2tbDjuqt6p-iAlvW92IQt6whV7VUrc-FaEahZfLINzzU4Ugf8Im5LEpO7Q-w5T7yXyvTTAxnZKR-Wk2XBi-nLUO_Q6SAIG-q0nuJYRQt_wKssLH_zC411zRvIDoscK901RZ6cLy4eB0IknbTW9aFzQFeZTpksrKc">
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[9999px]">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgAb6AXuBpsetJmHs64EdgScpNwtAeAbNsO0Ow7LXtQBdcAakBoilzaXem187L2YRPzZoRylemrqLWcTgIeHopEERhg3GpKaJ5W1Q5APRm6VnHvtdj2TbDjuqt6PIAlvW92IQt6WhV7VUrcFaEahZfLiNzzU4Ugf8Im5LEpO7QW5T7YXyvTtAxnZkrWk2XBiNLuoQ6SaigQ0NuJyrQtWKssLhZC411ZRvIDoscK901Rz6CLy4EB0IknbTw9AFzQFeZTpksrKc} />
      </div>
    </div>
  );
}

function Container71() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Marcus Thorne</p>
      </div>
    </div>
  );
}

function Container72() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#424754] text-[12px] whitespace-nowrap">
        <p className="leading-[16px] mb-0">Submitted: Neural Networks</p>
        <p className="leading-[16px]">Part 2</p>
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-[#0058be] content-stretch flex flex-col items-center justify-center px-[12px] py-[4px] relative rounded-[9999px] shrink-0" data-name="Button">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-center text-white uppercase whitespace-nowrap">
        <p className="leading-[15px]">REVIEW</p>
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div className="bg-[#eff4ff] content-stretch flex flex-col items-center justify-center px-[12px] py-[4px] relative rounded-[9999px] shrink-0" data-name="Button">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#424754] text-[10px] text-center uppercase whitespace-nowrap">
        <p className="leading-[15px]">SKIP</p>
      </div>
    </div>
  );
}

function Container73() {
  return (
    <div className="content-stretch flex gap-[8px] items-start pt-[8px] relative shrink-0 w-full" data-name="Container">
      <Button6 />
      <Button7 />
    </div>
  );
}

function Container70() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0 w-[159.7px]" data-name="Container">
      <Container71 />
      <Container72 />
      <Container73 />
    </div>
  );
}

function Container69() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <Ab6AXuBpsetJmHs64EdgScpNwtAeAbNsO0Ow7LXtQBdcAakBoilzaXem187L2YRPzZoRylemrqLWcTgIeHopEERhg3GpKaJ5W1Q5APRm6VnHvtdj2TbDjuqt6PIAlvW92IQt6WhV7VUrcFaEahZfLiNzzU4Ugf8Im5LEpO7QW5T7YXyvTtAxnZkrWk2XBiNLuoQ6SaigQ0NuJyrQtWKssLhZC411ZRvIDoscK901Rz6CLy4EB0IknbTw9AFzQFeZTpksrKc />
      <Container70 />
    </div>
  );
}

function Ab6AXuCmj3HCxa8VpxYlmChtTcLyKq2RXKlvkC2PijmLu2VizpAXtbOphO2ZvYDuqfnfzUKdsnwq3UsCrCs3PhWyj0Fa3LoeT6TBbbXvjpcSvoshAuNbKEfi6So6M1N5KuaXwwAqhOzHrC2Skzg4HFqosCxSitAyfvMRvguB7H8D7Gjt2RX9Rpj6VQbTeiGhrH2TnOym4UhcPDgax0Oyue7J9LEi61Uzs5ArWcusiZpqWLwBknFs2WJZpfJnNK0Df7A38UZag() {
  return (
    <div className="max-w-[224px] relative rounded-[9999px] shrink-0 size-[40px]" data-name="AB6AXuCmj3hCXA8VpxYlmCHTTcLyKQ2rXKlvkC2PIJMLu2VizpAXtbOPH-O2-ZvYDuqfnfzUKdsnwq3USCrCs3PhWyj0FA3loeT6tBbbXVJPC_SvoshAuNbKEfi6So6M-1N5kuaXww_AQHOzHrC2skzg4hFqosCxSITAyfvM_rvguB7h8D7Gjt2rX9RPJ6vQbTEIGhrH2TnOYM4uhc-PDgax0oyue7J9lEI61UZS5ArWcusiZpqW_LwBknFS2wJZpfJnN-K0df7a38U-zag">
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[9999px]">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgAb6AXuCmj3HCxa8VpxYlmChtTcLyKq2RXKlvkC2PijmLu2VizpAXtbOphO2ZvYDuqfnfzUKdsnwq3UsCrCs3PhWyj0Fa3LoeT6TBbbXvjpcSvoshAuNbKEfi6So6M1N5KuaXwwAqhOzHrC2Skzg4HFqosCxSitAyfvMRvguB7H8D7Gjt2RX9Rpj6VQbTeiGhrH2TnOym4UhcPDgax0Oyue7J9LEi61Uzs5ArWcusiZpqWLwBknFs2WJZpfJnNK0Df7A38UZag} />
      </div>
    </div>
  );
}

function Container76() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Elena Rodriguez</p>
      </div>
    </div>
  );
}

function Container77() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#424754] text-[12px] whitespace-nowrap">
        <p className="leading-[16px] mb-0">Submitted: Thesis Proposal</p>
        <p className="leading-[16px]">Final</p>
      </div>
    </div>
  );
}

function Button8() {
  return (
    <div className="bg-[#0058be] content-stretch flex flex-col items-center justify-center px-[12px] py-[4px] relative rounded-[9999px] shrink-0" data-name="Button">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-center text-white uppercase whitespace-nowrap">
        <p className="leading-[15px]">REVIEW</p>
      </div>
    </div>
  );
}

function Button9() {
  return (
    <div className="bg-[#eff4ff] content-stretch flex flex-col items-center justify-center px-[12px] py-[4px] relative rounded-[9999px] shrink-0" data-name="Button">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#424754] text-[10px] text-center uppercase whitespace-nowrap">
        <p className="leading-[15px]">SKIP</p>
      </div>
    </div>
  );
}

function Container78() {
  return (
    <div className="content-stretch flex gap-[8px] items-start pt-[8px] relative shrink-0 w-full" data-name="Container">
      <Button8 />
      <Button9 />
    </div>
  );
}

function Container75() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0 w-[154.97px]" data-name="Container">
      <Container76 />
      <Container77 />
      <Container78 />
    </div>
  );
}

function Container74() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <Ab6AXuCmj3HCxa8VpxYlmChtTcLyKq2RXKlvkC2PijmLu2VizpAXtbOphO2ZvYDuqfnfzUKdsnwq3UsCrCs3PhWyj0Fa3LoeT6TBbbXvjpcSvoshAuNbKEfi6So6M1N5KuaXwwAqhOzHrC2Skzg4HFqosCxSitAyfvMRvguB7H8D7Gjt2RX9Rpj6VQbTeiGhrH2TnOym4UhcPDgax0Oyue7J9LEi61Uzs5ArWcusiZpqWLwBknFs2WJZpfJnNK0Df7A38UZag />
      <Container75 />
    </div>
  );
}

function Container68() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Container">
      <Container69 />
      <Container74 />
    </div>
  );
}

function SectionRecentSubmissions() {
  return (
    <div className="bg-[#d3e4fe] relative rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 w-full" data-name="Section - Recent Submissions">
      <div className="content-stretch flex flex-col gap-[24px] items-start p-[32px] relative size-full">
        <Heading10 />
        <Container68 />
      </div>
    </div>
  );
}

function Heading11() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Heading 3">
      <div className="flex flex-col font-['Manrope:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[18px] text-white whitespace-nowrap">
        <p className="leading-[28px]">Growth Insight</p>
      </div>
    </div>
  );
}

function Container80() {
  return (
    <div className="h-[20px] relative shrink-0 w-[16px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 20">
        <g id="Container">
          <path d={svgPaths.p12df5c00} fill="var(--fill-0, #6FFBBE)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container79() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Heading11 />
      <Container80 />
    </div>
  );
}

function Container81() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[9.775px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#dbeafe] text-[14px] w-full">
        <p className="leading-[22.75px] mb-0">{`Your content "Modern`}</p>
        <p className="leading-[22.75px] mb-0">{`Architecture" is trending among`}</p>
        <p className="leading-[22.75px] mb-0">4th-year students. Consider</p>
        <p className="leading-[22.75px]">{`adding a live Q&A session.`}</p>
      </div>
    </div>
  );
}

function Container84() {
  return (
    <div className="content-stretch flex flex-col items-start opacity-60 relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-white uppercase whitespace-nowrap">
        <p className="leading-[15px]">AVG. SCORE</p>
      </div>
    </div>
  );
}

function Container85() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[24px] text-white whitespace-nowrap">
        <p className="leading-[32px]">94.2%</p>
      </div>
    </div>
  );
}

function Container83() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[77.25px]" data-name="Container">
      <Container84 />
      <Container85 />
    </div>
  );
}

function Container87() {
  return (
    <div className="content-stretch flex flex-col items-end opacity-60 relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-right text-white uppercase whitespace-nowrap">
        <p className="leading-[15px]">COMPLETION</p>
      </div>
    </div>
  );
}

function Container88() {
  return (
    <div className="content-stretch flex flex-col items-end relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[24px] text-right text-white whitespace-nowrap">
        <p className="leading-[32px]">88%</p>
      </div>
    </div>
  );
}

function Container86() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[67.09px]" data-name="Container">
      <Container87 />
      <Container88 />
    </div>
  );
}

function Container82() {
  return (
    <div className="content-stretch flex items-end justify-between relative shrink-0 w-full" data-name="Container">
      <Container83 />
      <Container86 />
    </div>
  );
}

function OverlayOverlayBlur() {
  return (
    <div className="backdrop-blur-[2px] bg-[rgba(255,255,255,0.1)] relative rounded-[8px] shrink-0 w-full" data-name="Overlay+OverlayBlur">
      <div className="content-stretch flex flex-col items-start p-[16px] relative size-full">
        <Container82 />
      </div>
    </div>
  );
}

function SectionAcademyHealth() {
  return (
    <div className="relative rounded-[12px] shrink-0 w-full" style={{ backgroundImage: "linear-gradient(133.643deg, rgb(0, 88, 190) 0%, rgb(33, 112, 228) 100%)" }} data-name="Section - Academy Health">
      <div className="content-stretch flex flex-col gap-[15.1px] items-start p-[32px] relative size-full">
        <Container79 />
        <Container81 />
        <OverlayOverlayBlur />
      </div>
    </div>
  );
}

function SecondaryColumn() {
  return (
    <div className="col-3 content-stretch flex flex-col gap-[32px] items-start justify-self-stretch relative row-1 self-start shrink-0" data-name="Secondary Column (1/3)">
      <SectionRecentSubmissions />
      <SectionAcademyHealth />
    </div>
  );
}

function ActivityMaterialsSection() {
  return (
    <div className="gap-x-[32px] gap-y-[32px] grid grid-cols-[repeat(3,minmax(0,1fr))] grid-rows-[_640px] relative shrink-0 w-full" data-name="Activity & Materials Section">
      <MainActivityFeed />
      <SecondaryColumn />
    </div>
  );
}

function MainContent() {
  return (
    <div className="flex-[1_0_0] max-w-[1280px] min-h-px min-w-px relative self-stretch" data-name="Main Content">
      <div className="content-stretch flex flex-col gap-[48px] items-start max-w-[inherit] p-[48px] relative size-full">
        <Header />
        <SummaryBentoGrid />
        <ActivityMaterialsSection />
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full z-[1]" data-name="Container">
      <AsideSideNavBar />
      <MainContent />
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="bg-[#f8f9ff] content-stretch flex flex-col isolate items-start relative size-full" data-name="仪表盘 Dashboard">
      <HeaderTopNavBar />
      <Container6 />
    </div>
  );
}